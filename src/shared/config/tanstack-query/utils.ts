'use client'

import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { useUserStore } from '@entities/member/context/UserStore'
import { URL } from '@shared/constants/route/route'
import { useToastStore } from '@shared/context/toast/ToastStore'
import { ToastType } from '@shared/context/toast/type'
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

export const handleError = (error: ErrorResponse) => {
  if (error.status === 401) return

  const openToast = useToastStore.getState().open
  openToast(ToastType.Error, error.message)
}
