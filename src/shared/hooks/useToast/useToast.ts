import { useCallback } from 'react'
import { useToastStore } from '@shared/context/Toast/ToastStore'
import { ToastType } from '@shared/context/Toast/type'

export function useToast() {
    const show = useToastStore(s => s.show)
    return useCallback(
        (msg: string, type: ToastType = ToastType.Success) => show(msg, type),
        [show]
      )
  }