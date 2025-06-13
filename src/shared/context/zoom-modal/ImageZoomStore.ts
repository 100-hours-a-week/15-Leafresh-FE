import { create } from 'zustand'

import { ChallengeVerificationResultType } from '@entities/common/type'

import { ZoomModalStore } from './type'

export type ImageZoomModalData = {
  result: ChallengeVerificationResultType
  imageSrc: string
  description: string
}

type ImageZoomModalStore = ZoomModalStore<ImageZoomModalData>

export const useImageZoomStore = create<ImageZoomModalStore>(set => ({
  isOpen: false,
  data: [],
  targetIndex: 0,

  open: (data: ImageZoomModalData[], targetIndex: number) => {
    set({ isOpen: true, data, targetIndex })
  },

  close: () => {
    set({ isOpen: false, data: [], targetIndex: 0 })
  },

  setTargetIndex: (targetIndex: number) => {
    set({ targetIndex })
  },
}))
