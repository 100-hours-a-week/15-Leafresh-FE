'use client'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { LoginCallback, ProfileResponse } from '@/entities/member/api'
import { LowercaseOAuthType } from '@/entities/member/model'

import { Loading } from '@/shared/components'
import { getQueryClient, QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useOAuthStateStore, useOAuthUserStore, UserInfo, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import * as S from './styles'

interface CallbackPageProps {
  provider: LowercaseOAuthType
}

export const CallbackPage = ({ provider }: CallbackPageProps) => {
  const queryClient = getQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

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
    enabled: typeof code === 'string' && code.length > 0 && state !== null,
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

      toast('Success', '로그인 성공')
      router.replace(URL.MAIN.INDEX.value)
    }
  }, [data])

  if (isError) {
    toast('Error', `${provider} 로그인 실패\n재시도 해주세요`)
    router.replace(URL.MEMBER.LOGIN.value)
  }

  return (
    <S.LoadingWrapper>
      <Loading />
    </S.LoadingWrapper>
  )
}
