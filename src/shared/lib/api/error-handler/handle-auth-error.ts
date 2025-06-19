'use client'

import { URL } from '@shared/constants/route'
import { useOAuthUserStore } from '@shared/context/auth/oauth-user/oauth-user-store'
import { useUserStore } from '@shared/context/auth/user/user-store'
import { ErrorResponse } from '@shared/lib/api/type'

let isHandlingAuth = false

export const handleAuthError = (error: ErrorResponse) => {
  if (typeof window === 'undefined') return
  if (error.status !== 401 || isHandlingAuth) return

  isHandlingAuth = true
  useOAuthUserStore.getState().clearOAuthUserInfo()
  useUserStore.getState().clearUserInfo()

  window.location.href = `${URL.MEMBER.LOGIN.value}?expired=true` // 라우팅 후 토스트를 띄우기 위해 쿼리 사용
}
