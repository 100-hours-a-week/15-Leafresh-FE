import { create } from 'zustand'

interface BackButtonState {
  isVisible: boolean
  onClick?: () => void
  show: (onClick?: () => void) => void
  hide: () => void
}

export const useBackButtonStore = create<BackButtonState>(set => ({
  isVisible: false,
  onClick: undefined,
  show: onClick => set({ isVisible: true, onClick }),
  hide: () => set({ isVisible: false, onClick: undefined }),
}))
