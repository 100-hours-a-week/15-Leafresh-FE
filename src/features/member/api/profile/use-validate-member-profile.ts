// use-validate-member-profile.ts
import { useEffect, useState } from 'react'

import { useUserStore } from '@/shared/context'
import { UserInfo } from '@/shared/context'

import { useGetMemberProfile } from './use-get-profile'

interface UseValidateMemberProfileOptions {
  enabled: boolean
  onError?: (error: unknown) => void
}

/**
 * JWT 토큰을 통해 로그인 상태를 최신화하는 훅
 * @param enabled 실행 여부
 * @param onError 에러 시 실행할 콜백 함수
 * @returns isAuthVerified : 로그인 여부
 */
export const useValidateMemberProfile = ({ enabled, onError }: UseValidateMemberProfileOptions) => {
  const { setUserInfo, clearUserInfo } = useUserStore()
  const [isAuthVerified, setIsAuthVerified] = useState<boolean>(!enabled)

  const { data, isSuccess, isError, error } = useGetMemberProfile({ enabled })

  useEffect(() => {
    if (!enabled) {
      setIsAuthVerified(true)
      return
    }

    if (isSuccess && data?.data) {
      const { nickname, email, profileImageUrl, treeImageUrl, treeLevelId, treeLevelName } = data.data

      const userInfo: UserInfo = {
        nickname,
        email,
        imageUrl: profileImageUrl,
        treeState: {
          level: treeLevelId,
          name: treeLevelName,
          imageUrl: treeImageUrl,
        },
      }

      setUserInfo(userInfo)
      setIsAuthVerified(true)
    }

    if (isError) {
      clearUserInfo()
      onError?.(error)
    }
  }, [enabled, isSuccess, isError, data])

  return { isAuthVerified }
}
