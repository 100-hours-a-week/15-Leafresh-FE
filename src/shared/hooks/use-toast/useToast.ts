import { useCallback } from 'react'

import { ToastType, useToastStore } from '@/shared/context'

export function useToast() {
  const { open } = useToastStore()
  return useCallback((type: ToastType = ToastType.Success, description: string) => open(type, description), [open])
}
