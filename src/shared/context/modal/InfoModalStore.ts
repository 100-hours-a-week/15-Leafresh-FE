import { create } from 'zustand'

export type InfoModalVariant = 'default' | 'minimal'

interface InfoModalState {
  isOpen: boolean
  title: string
  description?: string
  variant: InfoModalVariant
  onClose?: () => void
  openInfoModal: (payload: {
    title: string
    description?: string
    variant?: InfoModalVariant
    onClose?: () => void
    onCancel?: () => void
  }) => void
  closeInfoModal: () => void
}

export const useInfoModalStore = create<InfoModalState>(set => ({
  isOpen: false,
  title: '',
  description: undefined,
  variant: 'default',
  onClose: undefined,
  onCancel: undefined,

  openInfoModal: ({
    title,
    description,
    variant = 'default',
    onClose,
  }) =>
    set({
      isOpen: true,
      title,
      description,
      variant,
      onClose,
    }),

  closeInfoModal: () =>
    set({
      isOpen: false,
      title: '',
      description: undefined,
      variant: 'default',
      onClose: undefined,
    }),
}))
