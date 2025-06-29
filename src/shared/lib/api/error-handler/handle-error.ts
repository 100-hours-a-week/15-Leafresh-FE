'use client'

import { toastStore, ToastType } from '@/shared/context'

import { ErrorResponse } from '../type'

export const handleError = (error: ErrorResponse) => {
  if (error.status === 401) return

  const openToast = toastStore.getState().open
  openToast(ToastType.Error, error.message)
}
