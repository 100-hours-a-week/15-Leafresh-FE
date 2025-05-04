import { create } from 'zustand'

export type InfoModalVariant = 'default' | 'minimal' | 'long'

interface InfoModalState {
  isOpen: boolean
  title: string
  description?: string
  variant: InfoModalVariant
  onClose?: () => void
  onCancel?: () => void //figma 상의 취소 버튼 존재. 추후 수정
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
    onCancel,
  }) =>
    set({
      isOpen: true,
      title,
      description,
      variant,
      onClose,
      onCancel,
    }),

  closeInfoModal: () =>
    set({
      isOpen: false,
      title: '',
      description: undefined,
      variant: 'default',
      onClose: undefined,
      onCancel: undefined,
    }),
}))