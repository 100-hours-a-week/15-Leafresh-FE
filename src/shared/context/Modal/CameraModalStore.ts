import { create } from 'zustand'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'

interface CameraModalState {
  isOpen: boolean
  title: string
  onComplete: (data: { imageUrl: string; description?: string }) => void
  hasDescription: boolean
  type?: ChallengeVerificationStatusType

  open: (
    title: string,
    onComplete: (data: { imageUrl: string; description?: string }) => void,
    hasDescription?: boolean,
    type?: ChallengeVerificationStatusType,
  ) => void

  close: () => void
}

export const useCameraModalStore = create<CameraModalState>(set => ({
  isOpen: false,
  title: '',
  hasDescription: false,
  type: 'SUCCESS',
  onComplete: () => {},
  open: (title, onComplete, hasDescription = false, type) =>
    set({ isOpen: true, title, onComplete, hasDescription, type }),
  close: () => set({ isOpen: false, hasDescription: false }),
}))
