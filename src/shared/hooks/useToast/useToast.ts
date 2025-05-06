import { useCallback } from 'react'

import { useToastStore } from '@shared/context/Toast/ToastStore'
import { ToastType } from '@shared/context/Toast/type'

export function useToast() {
  const { openToast } = useToastStore()
  return useCallback(
    (type: ToastType = ToastType.Success, description: string) => openToast(type, description),
    [openToast],
  )
}
