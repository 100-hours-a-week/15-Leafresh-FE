import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { URL } from '@shared/constants/route/route'
import { useToastStore } from '@shared/context/Toast/ToastStore'
import { ToastType } from '@shared/context/Toast/type'

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

const BASE_URL = 'https://leafresh.app'

export async function refreshAccessToken(): Promise<void> {
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
      // 로그인 정보 초기화
      useOAuthUserStore.getState().clearUserInfo()

      // 클라이언트 컴포넌트면 로그인 페이지로 리디렉션
      if (typeof window !== 'undefined') {
        openToast(ToastType.Error, '세션이 만료되었습니다.\n재로그인 해주세요')
        window.location.href = URL.MEMBER.LOGIN.value
      }

      isRefreshing = false
      throw error
    }
  })()

  return refreshPromise
}
