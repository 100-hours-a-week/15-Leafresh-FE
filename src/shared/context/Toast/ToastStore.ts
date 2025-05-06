import { create } from 'zustand'

import { ToastStore, ToastType } from './type'

export const useToastStore = create<ToastStore>(set => ({
  isOpen: false,
  type: ToastType.Success,
  description: '',
  open: (type, description) => set({ isOpen: true, type, description }),
  close: () => set({ isOpen: false, description: null }),
}))
