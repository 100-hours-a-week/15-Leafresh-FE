import { create } from 'zustand'

import { ChallengeVerificationResultType } from '@entities/challenge/type'
interface CameraModalState {
  isOpen: boolean

  title: string
  onConfirm: (imageUrl: string, description?: string) => void

  hasDescription: boolean // 이미지에 대한 설명을 받는지 여부
  type?: ChallengeVerificationResultType
  open: (
    title: string,
    onConfirm: (imageUrl: string, description?: string) => void,
    hasDescription?: boolean,
    type?: ChallengeVerificationResultType,
  ) => void
  close: () => void
}

export const useCameraModalStore = create<CameraModalState>(set => ({
  isOpen: false,
  title: '',
  hasDescription: false,
  type: 'SUCCESS',
  onConfirm: () => {},
  open: (title, onConfirm, hasDescription = false, type) =>
    set({ isOpen: true, title, onConfirm, hasDescription, type }),
  close: () => set({ isOpen: false, hasDescription: false }),
}))
