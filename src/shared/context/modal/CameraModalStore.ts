import { create } from 'zustand'

import { ChallengeType, ChallengeVerificationStatusType } from '@entities/common/type'

export type ChallengeDataType = {
  id: number
  type: ChallengeType
}
interface CameraModalState {
  isOpen: boolean

  title: string
  // 챌린지 규약 정보를 위한 챌린지 데이터
  challengeData?: ChallengeDataType

  onComplete: (data: { imageUrl: string; description?: string }) => void
  hasDescription: boolean
  status?: ChallengeVerificationStatusType

  open: (
    title: string,
    onComplete: (data: { imageUrl: string; description?: string }) => void,
    hasDescription?: boolean,
    status?: ChallengeVerificationStatusType,
    challengeData?: ChallengeDataType,
  ) => void

  close: () => void
}

export const useCameraModalStore = create<CameraModalState>(set => ({
  isOpen: false,
  title: '',
  challengeData: undefined,
  hasDescription: false,
  status: undefined,
  onComplete: () => {},

  open: (title, onComplete, hasDescription = false, status, challengeData) =>
    set({ isOpen: true, title, onComplete, hasDescription, status, challengeData }),

  close: () => set({ title: '', isOpen: false, challengeData: undefined, status: undefined, hasDescription: false }),
}))
