import { FeedbackResponse } from '@features/member/api/profile/get-member-feedback'
import { getQueryClient } from '@shared/config/tanstack-query/query-client'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher'

export async function pollFeedbackResult(): Promise<void> {
  const queryClient = getQueryClient()
  try {
    while (true) {
      const response = await fetchRequest<FeedbackResponse>(ENDPOINTS.MEMBERS.FEEDBACK.RESULT)
      if (response.status != 200) throw new Error('Failed polling')

      if (response.status === 200 && response.data?.content) {
        queryClient.setQueryData(QUERY_KEYS.MEMBER.FEEDBACK.GET_FEEDBACK, {
          data: response.data,
          message: '피드백 수신 완료',
          status: 200,
        })
        break
      }

      // 404면 아직 준비 안됨 → 재시도
      await new Promise(res => setTimeout(res, 3000)) // 3초 간격
    }
  } catch (err) {
    console.error('롱폴링 중 오류 발생:', err)
  }
}
