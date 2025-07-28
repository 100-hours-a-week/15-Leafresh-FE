import { persist } from 'zustand/middleware'

import { create } from 'zustand'

export interface UserInfo {
  nickname: string
  email: string
  imageUrl: string
  treeState: {
    level: number
    name: string
    imageUrl: string
  }
}

interface UserState {
  userInfo: UserInfo | null
  isLoggedIn: boolean

  setUserInfo: (info: UserInfo) => void
  clearUserInfo: () => void
  updateUserInfo: (updatedFields: Partial<UserInfo>) => void
}

/** 유저 정보를 저장하는 전역 상태 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userInfo: null,
      isLoggedIn: false,

      setUserInfo: info => set({ userInfo: info, isLoggedIn: true }),
      clearUserInfo: () => set({ userInfo: null, isLoggedIn: false }),
      updateUserInfo: updatedFields => {
        const prev = get().userInfo
        if (!prev) return
        set({
          userInfo: { ...prev, ...updatedFields },
          isLoggedIn: get().isLoggedIn,
        })
      },
    }),
    {
      name: 'user-info', // localStorage key
      partialize: state => ({ userInfo: state.userInfo }), // 선택적 저장
    },
  ),
)
