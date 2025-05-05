export enum ToastType {
    Success = 'success',
    Error   = 'error',
    //다른 타입은 추후 확장
  }
  
export interface ToastStore {
  isOpen:   boolean
  type:     ToastType
  message:  string | null
  show:     (message: string, type: ToastType) => void
  clear:    () => void
}