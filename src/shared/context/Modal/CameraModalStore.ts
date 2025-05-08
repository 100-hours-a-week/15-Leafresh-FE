import { create } from 'zustand'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
interface CameraModalState {
  isOpen: boolean

  title: string
  onImageChange: (imageUrl: string) => void
  onDescriptionChange: (description: string) => void
  hasDescription: boolean // 이미지에 대한 설명을 받는지 여부
  type?: ChallengeVerificationStatusType // 어떤 이미지에 대한 설명인지 (hasDescription이 true이면 반드시 받아야 함)

  open: (
    title: string,
    onImageChange: (imageUrl: string) => void,
    onDescriptionChange?: (description: string) => void,
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
  onImageChange: () => {},
  onDescriptionChange: () => {},
  open: (title, onImageChange, onDescriptionChange, hasDescription = false, type) =>
    set({ isOpen: true, title, onImageChange, onDescriptionChange, hasDescription, type }),
  close: () => set({ isOpen: false, hasDescription: false }),
}))
