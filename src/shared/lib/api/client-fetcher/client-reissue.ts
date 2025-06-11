import { BASE_API_URL } from '@shared/constants/api-url'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

const BASE_URL = BASE_API_URL

export async function refreshClientAccessToken(): Promise<void> {
  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.MEMBERS.AUTH.RE_ISSUE}`, {
        method: 'POST',
        credentials: 'include', // 재발급은 쿠키 포함
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
