import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PollingState = {
  personalChallengeIds: number[]
  addChallengeId: (id: number) => void
  removeChallengeId: (id: number) => void
}

export const usePollingStore = create<PollingState>()(
  persist(
    (set, get) => ({
      personalChallengeIds: [],
      addChallengeId: (id: number) => {
        const current = get().personalChallengeIds
        if (!current.includes(id)) {
          set({ personalChallengeIds: [...current, id] })
        }
      },
      removeChallengeId: (id: number) => {
        const filtered = get().personalChallengeIds.filter(chId => chId !== id)
        set({ personalChallengeIds: filtered })
      },
    }),
    {
      name: 'polling-store',
      partialize: state => ({ personalChallengeIds: state.personalChallengeIds }), // 필요한 키만 저장
    },
  ),
)
