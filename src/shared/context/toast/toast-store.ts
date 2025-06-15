import { create } from 'zustand'

export enum ToastType {
  Success = 'success',
  Error = 'error',
  //다른 타입은 추후 확장
}

export interface ToastStore {
  isOpen: boolean
  type: ToastType
  description: string | null
  open: (type: ToastType, description: string) => void
  close: () => void
}

export const useToastStore = create<ToastStore>(set => ({
  isOpen: false,
  type: ToastType.Success,
  description: '',
  open: (type, description) => set({ isOpen: true, type, description }),
  close: () => set({ isOpen: false, description: null }),
}))
