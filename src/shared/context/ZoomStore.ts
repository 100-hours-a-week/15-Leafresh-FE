import { create } from 'zustand'

import { ChallengeVerificationResultType } from '@entities/challenge/type'

interface ZoomStoreState<DataType> {
  isOpen: boolean
  data: DataType[]
  targetIndex: number
  open: (data: DataType[], targetIndex: number) => void
  close: () => void
  setTargetIndex: (targetIndex: number) => void
}

export type ImageZoomData = {
  result: ChallengeVerificationResultType
  imageSrc: string
  description: string
}

type ImageZoomStoreState = ZoomStoreState<ImageZoomData>

export const useImageZoomStore = create<ImageZoomStoreState>(set => ({
  isOpen: false,
  data: [],
  targetIndex: 0,

  open: (data: ImageZoomData[], targetIndex: number) => {
    set({ isOpen: true, data, targetIndex })
  },

  close: () => {
    set({ isOpen: false, data: [], targetIndex: 0 })
  },

  setTargetIndex: (targetIndex: number) => {
    set({ targetIndex })
  },
}))
