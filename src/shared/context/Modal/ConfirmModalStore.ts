import { create } from 'zustand'

interface ConfirmModalState {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel?: () => void
  openConfirmModal: (payload: {
    title: string
    description: string
    onConfirm: () => void
    onCancel?: () => void
  }) => void
  closeConfirmModal: () => void
}

export const useConfirmModalStore = create<ConfirmModalState>(set => ({
  isOpen: false,
  title: '',
  description: '',
  onConfirm: () => {},
  onCancel: undefined,
  openConfirmModal: ({ title, description, onConfirm, onCancel }) =>
    set({ isOpen: true, title, description, onConfirm, onCancel }),
  closeConfirmModal: () => set({ isOpen: false, title: '', description: '', onConfirm: () => {}, onCancel: undefined }),
}))
