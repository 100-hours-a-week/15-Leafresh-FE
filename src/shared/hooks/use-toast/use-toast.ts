import { toastStore } from '@/shared/context'

// TODO: 토스트 최적화시 삭제
export function useToast() {
  const { toasts, toast, remove } = toastStore()
  return {
    toasts: toasts,
    toast,
  }
}
