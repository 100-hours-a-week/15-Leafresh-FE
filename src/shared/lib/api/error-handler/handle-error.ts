'use client'

import { toastStore } from '@/shared/context'

import { ErrorResponse } from '../type'

export const handleError = (error: ErrorResponse) => {
  if (error.status === 401) return

  const openToast = toastStore.getState().toast
  openToast('Error', error.message)
}
