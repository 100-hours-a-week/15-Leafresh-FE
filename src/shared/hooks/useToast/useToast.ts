import { useCallback } from 'react'

import { useToastStore } from '@shared/context/toast/toast-store'
import { ToastType } from '@shared/context/toast/type'

export function useToast() {
  const { open } = useToastStore()
  return useCallback((type: ToastType = ToastType.Success, description: string) => open(type, description), [open])
}
