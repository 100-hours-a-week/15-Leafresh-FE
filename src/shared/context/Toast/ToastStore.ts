import { create } from 'zustand'

import { ToastStore, ToastType } from './type'

export const useToastStore = create<ToastStore>(set => ({
  isOpen: false,
  type: ToastType.Success,
  description: '',
  openToast: (type, description) => set({ isOpen: true, type, description }),
  closeToast: () => set({ isOpen: false, description: null }),
}))
