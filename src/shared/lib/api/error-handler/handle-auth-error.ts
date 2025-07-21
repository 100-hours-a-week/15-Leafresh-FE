'use client'

import { URL } from '@/shared/constants'
import { useOAuthUserStore, useUserStore } from '@/shared/context'

import { ErrorResponse } from '../type'

let isHandlingAuth = false

export const handleAuthError = (error: ErrorResponse) => {
  if (typeof window === 'undefined') return
  if (error.status !== 401 || isHandlingAuth) return

  isHandlingAuth = true
  useOAuthUserStore.getState().clearOAuthUserInfo()
  useUserStore.getState().clearUserInfo()

  window.location.href = URL.MEMBER.LOGIN.value(undefined, true) // 라우팅 후 토스트를 띄우기 위해 쿼리 사용
}
