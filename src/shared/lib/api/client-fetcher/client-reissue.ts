import { BASE_API_URL } from '@shared/constants/api-url'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { useToastStore } from '@shared/context/toast/ToastStore'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

//TODO: dev/prod 환경에 따라 서로 다른 도메인 설정
const BASE_URL = BASE_API_URL

export async function refreshClientAccessToken(): Promise<void> {
  const openToast = useToastStore.getState().open

  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.MEMBERS.AUTH.RE_ISSUE}`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      isRefreshing = false
    } catch (error) {
      isRefreshing = false
      throw error // ❌ 핸들링 X (fetchRequest에서 처리)
    }
  })()

  return refreshPromise
}
