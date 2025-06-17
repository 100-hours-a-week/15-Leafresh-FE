import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PollingData = {
  challenge: {
    // 인증
    verification: {
      personalChallengeIdList: number[] // 개인 챌린지 인증
      groupChallengeIdList: number[] // 단체 챌린지 인증
    }
    pendingApprovalChallengeIdList: number[] // 단체 챌린지 생성
  }
  //
  member: {
    feedback: boolean
  }
}

type PollingStore = {
  polling: PollingData

  // 개인 챌린지 인증
  addPersonalChallengeId: (id: number) => void
  removePersonalChallengeId: (id: number) => void

  // 단체 챌린지 인증
  addGroupChallengeId: (id: number) => void
  removeGroupChallengeId: (id: number) => void

  // 단체 챌린지 생성 검열
  addPendingApprovalChallengeIdList: (id: number) => void
  removePendingApprovalChallengeIdList: (id: number) => void

  // 피드백 폴링
  setFeedbackPolling: () => void
  clearFeedbackPolling: () => void
}

const INITIAL_STATE: PollingData = {
  challenge: {
    verification: {
      personalChallengeIdList: [],
      groupChallengeIdList: [],
    },
    pendingApprovalChallengeIdList: [],
  },
  member: {
    feedback: false,
  },
}

export const usePollingStore = create<PollingStore>()(
  persist(
    (set, get) => ({
      polling: INITIAL_STATE,

      // 개인 챌린지 인증
      addPersonalChallengeId: id => {
        const current = get().polling.challenge.verification.personalChallengeIdList
        if (current.includes(id)) return

        const appended: number[] = [...current, id]
        set({
          polling: {
            ...get().polling,
            challenge: {
              ...get().polling.challenge,
              verification: {
                ...get().polling.challenge.verification,
                personalChallengeIdList: appended,
              },
            },
          },
        })
      },

      removePersonalChallengeId: id => {
        const current = get().polling.challenge.verification.personalChallengeIdList
        const removed: number[] = current.filter(chId => chId !== id)
        set({
          polling: {
            ...get().polling,
            challenge: {
              ...get().polling.challenge,
              verification: {
                ...get().polling.challenge.verification,
                personalChallengeIdList: removed,
              },
            },
          },
        })
      },

      // 단체 챌린지 인증
      addGroupChallengeId: id => {
        const current = get().polling.challenge.verification.groupChallengeIdList
        if (current.includes(id)) return
        const appended: number[] = [...current, id]
        set({
          polling: {
            ...get().polling,
            challenge: {
              ...get().polling.challenge,
              verification: {
                ...get().polling.challenge.verification,
                groupChallengeIdList: appended,
              },
            },
          },
        })
      },

      removeGroupChallengeId: id => {
        const current = get().polling.challenge.verification.groupChallengeIdList

        const removed: number[] = current.filter(chId => chId !== id)
        set({
          polling: {
            ...get().polling,
            challenge: {
              ...get().polling.challenge,
              verification: {
                ...get().polling.challenge.verification,
                groupChallengeIdList: removed,
              },
            },
          },
        })
      },

      // 단체 챌린지 생성 검열
      addPendingApprovalChallengeIdList: id => {
        const current = get().polling.challenge.pendingApprovalChallengeIdList
        if (current.includes(id)) return

        const appended: number[] = [...current, id]
        set({
          polling: {
            ...get().polling,
            challenge: {
              ...get().polling.challenge,
              pendingApprovalChallengeIdList: appended,
            },
          },
        })
      },

      removePendingApprovalChallengeIdList: id => {
        const current = get().polling.challenge.pendingApprovalChallengeIdList

        const removed: number[] = current.filter(chId => chId !== id)
        set({
          polling: {
            ...get().polling,
            challenge: {
              ...get().polling.challenge,
              pendingApprovalChallengeIdList: removed,
            },
          },
        })
      },

      // 피드백 폴링
      setFeedbackPolling: () => {
        set({
          polling: {
            ...get().polling,
            member: {
              ...get().polling.member,
              feedback: true,
            },
          },
        })
      },

      clearFeedbackPolling: () => {
        set({
          polling: {
            ...get().polling,
            member: {
              ...get().polling.member,
              feedback: false,
            },
          },
        })
      },
    }),
    {
      name: 'polling-store',
      partialize: state => ({
        polling: state.polling,
      }),
    },
  ),
)
