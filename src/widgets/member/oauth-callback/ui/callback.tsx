'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { LoginCallback } from '@entities/member/api/callback-oauth'
import { ProfileResponse } from '@entities/member/api/profile/get-profile'
import { LowercaseOAuthType } from '@entities/member/model/type'
import Loading from '@shared/components/loading/ui/loading'
import { getQueryClient } from '@shared/config/tanstack-query/query-client'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { URL } from '@shared/constants/route'
import { useOAuthStateStore } from '@shared/context/auth/oauth-state/oauth-state'
import { useOAuthUserStore } from '@shared/context/auth/oauth-user/oauth-user-store'
import { UserInfo, useUserStore } from '@shared/context/auth/user/user-store'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/use-toast/useToast'
import { fetchRequest } from '@shared/lib/api'

interface CallbackPageProps {
  provider: LowercaseOAuthType
}

const CallbackPage = ({ provider }: CallbackPageProps) => {
  const queryClient = getQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const openToast = useToast()

  const { setOAuthUserInfo } = useOAuthUserStore()
  const { state } = useOAuthStateStore()
  const { userInfo, setUserInfo, clearUserInfo } = useUserStore()

  const code = searchParams.get('code')
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.AUTH.CALLBACK(provider),
    queryFn: () => {
      if (!code || !state) {
        return
      }
      return LoginCallback({
        provider,
        code,
        state,
      })
    },
    ...QUERY_OPTIONS.MEMBER.AUTH.CALLBACK,
    enabled: typeof code === 'string' && code.length > 0,
  })

  useEffect(() => {
    if (!data) return
    const { isMember, email, imageUrl, nickname } = data.data

    setOAuthUserInfo({ isMember, email, imageUrl, nickname, provider })

    if (!isMember) {
      router.replace(URL.MEMBER.SIGNUP.value)
    } else {
      // ✅ 로그인 성공 → 유저 정보 요청 → 전역 상태에 저장
      ;(async () => {
        try {
          const { data: profileData } = await fetchRequest<ProfileResponse>(ENDPOINTS.MEMBERS.DETAILS)
          if (profileData) {
            const { nickname, email, profileImageUrl, treeImageUrl, treeLevelId, treeLevelName } = profileData

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
          }
        } catch (err) {
          console.warn('유저 정보 가져오기 실패', err)
        }
      })()

      openToast(ToastType.Success, '로그인 성공')
      router.replace(URL.MAIN.INDEX.value)
    }
  }, [data])

  if (isLoading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    )
  }

  if (isError) {
    // openToast(ToastType.Error, `${provider} 로그인 실패\n재시도 해주세요`)

    return <p>로그인 실패</p>
  }

  // 데이터 로드 후 라우팅될 것이므로 빈 상태 반환
  return null
}

export default CallbackPage

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100dvh;

  display: flex;
  align-items: center;
  justify-content: center;
`
