import { create } from 'zustand'
import { ToastType, ToastStore } from './type'

export const useToastStore = create<ToastStore>((set) => ({
  isOpen:  false,
  type:    ToastType.Success,
  message: '',
  show:    (message, type) => set({ isOpen: true, message, type }),
  clear:   () => set({ isOpen: false, message: null }),
}))
