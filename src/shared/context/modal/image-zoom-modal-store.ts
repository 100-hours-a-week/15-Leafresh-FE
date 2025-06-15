import { create } from 'zustand'

import { ChallengeVerificationResultType } from '@entities/challenge/model'

export type ImageZoomModalData = {
  result: ChallengeVerificationResultType
  imageSrc: string
  description: string
}

export interface ZoomModalStore<DataType> {
  isOpen: boolean
  data: DataType[]
  targetIndex: number
  open: (data: DataType[], targetIndex: number) => void
  close: () => void
  setTargetIndex: (targetIndex: number) => void
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
