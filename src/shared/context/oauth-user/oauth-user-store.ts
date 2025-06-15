'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { LowercaseOAuthType } from '../../../entities/member/type'

export interface OAuthUserInfo {
  isMember: boolean
  email: string
  nickname: string
  imageUrl: string
  provider: LowercaseOAuthType
}

interface OAuthUserState {
  OAuthUserInfo: OAuthUserInfo | null
  setOAuthUserInfo: (info: OAuthUserInfo) => void
  clearOAuthUserInfo: () => void
}

/** 유저 OAuth 정보를 저장하는 전역 상태 (로그인 과정의 임시 데이터) */
export const useOAuthUserStore = create<OAuthUserState>()(
  persist(
    set => ({
      OAuthUserInfo: null,
      setOAuthUserInfo: info => set({ OAuthUserInfo: info }),
      clearOAuthUserInfo: () => set({ OAuthUserInfo: null }),
    }),
    {
      name: 'oauth-user-info', // localStorage key
      partialize: state => ({ userInfo: state.OAuthUserInfo }), // 선택적 저장
    },
  ),
)
