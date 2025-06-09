import { FeedbackResponse } from '@features/member/api/profile/get-member-feedback'
import { getQueryClient } from '@shared/config/tanstack-query/queryClient'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

export async function pollFeedbackResult(): Promise<void> {
  const queryClient = getQueryClient()
  try {
    while (true) {
      const response = await fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.RESULT)
      if (response.status != 200) throw new Error('Failed polling')

      if (response.status === 200 && response.data?.content) {
        // 쿼리 캐시를 직접 업데이트
        queryClient.setQueryData(['member', 'feedback'], { response })
        break
      }

      // 404면 아직 준비 안됨 → 재시도
      await new Promise(res => setTimeout(res, 3000)) // 3초 간격
    }
  } catch (err) {
    console.error('롱폴링 중 오류 발생:', err)
  }
}
