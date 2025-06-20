import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OAuthStateStore {
  state: string | null
  setState: (value: string) => void
  clearState: () => void
}

export const useOAuthStateStore = create(
  persist<OAuthStateStore>(
    set => ({
      state: null,
      setState: (value: string) => set({ state: value }),
      clearState: () => set({ state: null }),
    }),
    {
      name: 'oauth-state', // ✅ localStorage 키
    },
  ),
)
