import { create } from 'zustand'

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
  clearUserInfo: () => void
}

export const useOAuthUserStore = create<OAuthUserState>(set => ({
  userInfo: null,
  setUserInfo: info => set({ userInfo: info }),
  clearUserInfo: () => set({ userInfo: null }),
}))
