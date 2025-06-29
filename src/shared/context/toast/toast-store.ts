import { create } from 'zustand'

import { ToastState } from './type'

export const toastStore = create<ToastState>(set => ({
  toasts: [],
  open: (type, description) =>
    set(state => {
      const id = crypto.randomUUID()
      const nextToasts = [...state.toasts, { id, type, description }]
      if (nextToasts.length > 2) nextToasts.shift() // 가장 오래된 것 제거
      return { toasts: nextToasts }
    }),
  remove: (id: string) =>
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    })),
}))
