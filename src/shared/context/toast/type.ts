export enum ToastType {
  Success = 'success',
  Error = 'error',
}

type ToastItem = {
  id: string
  type: ToastType
  description: string
}

export interface ToastState {
  toasts: ToastItem[]
  toast: (type: ToastType, description: string) => void
  remove: (id: string) => void
}
