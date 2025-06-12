import { BASE_API_URL } from '@shared/constants/api-url'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

const BASE_URL = BASE_API_URL

export async function refreshClientAccessToken(): Promise<void> {
  console.log('재발급 로직 실행')

  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true

  console.log('✅ 재발급 진짜 실행')

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.MEMBERS.AUTH.RE_ISSUE.path}`, {
        method: 'POST',
        credentials: 'include', // 재발급은 쿠키 포함
      })
      console.log('❌ 리프레시 프로미스 실패')

      if (!response.ok) {
        throw new Error('Refresh failed')
      }
    } catch (error) {
      throw error // ❌ 핸들링 X (fetchRequest에서 처리)
    } finally {
      isRefreshing = false
    }
  })()

  return refreshPromise
}
