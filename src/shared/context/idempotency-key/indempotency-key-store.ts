import { create } from 'zustand'

type IdempotencyKeyState = {
  IdempotencyKey: string
  regenerateIdempotencyKey: () => void
}

export const useIdempotencyKeyStore = create<IdempotencyKeyState>(set => ({
  IdempotencyKey: crypto.randomUUID(),
  regenerateIdempotencyKey: () => set({ IdempotencyKey: crypto.randomUUID() }),
}))
