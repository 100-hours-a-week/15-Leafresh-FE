import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserInfo {
  nickname: string
  imageUrl: string
  treeState: {
    level: number
    name: string
    imageUrl: string
  }
}

interface UserState {
  userInfo: UserInfo | null
  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
  updateUserInfo: (updatedFields: Partial<UserInfo>) => void
}

/** 유저 정보를 저장하는 전역 상태 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      setUserInfo: info => set({ userInfo: info }),
      clearUserInfo: () => set({ userInfo: null }),
      updateUserInfo: updatedFields => {
        const prev = get().userInfo
        if (!prev) return
        set({ userInfo: { ...prev, ...updatedFields } })
      },
    }),
    {
      name: 'user-info', // localStorage key
      partialize: state => ({ userInfo: state.userInfo }), // 선택적 저장
    },
  ),
)
