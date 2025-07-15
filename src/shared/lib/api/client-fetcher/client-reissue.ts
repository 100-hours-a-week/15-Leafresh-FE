import { ENDPOINTS } from '../consts'
import { getClientFetchOrigin } from '../utils'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

export async function refreshClientAccessToken(): Promise<void> {
  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const origin = getClientFetchOrigin()
      const url = new URL(origin + ENDPOINTS.MEMBERS.AUTH.RE_ISSUE.path)

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
      })
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
