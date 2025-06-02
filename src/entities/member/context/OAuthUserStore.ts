'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { LowercaseOAuthType } from '../type'

export interface OAuthUserInfo {
  isMember: boolean
  email: string
  nickname: string
  imageUrl: string
  provider: LowercaseOAuthType
}

interface OAuthUserState {
  userInfo: OAuthUserInfo | null
  setUserInfo: (info: OAuthUserInfo) => void
  updateUserInfo: (info: Partial<OAuthUserInfo>) => void // 부분 업데이트
  clearUserInfo: () => void
}

export const useOAuthUserStore = create<OAuthUserState>()(
  persist(
    set => ({
      userInfo: null,
      setUserInfo: info => set({ userInfo: info }),
      updateUserInfo: info =>
        set(state => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...info } : null,
        })),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: 'oauth-user-info', // localStorage key
      partialize: state => ({ userInfo: state.userInfo }), // 선택적 저장
    },
  ),
)
