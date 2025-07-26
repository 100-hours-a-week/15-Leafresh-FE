'use client'

import { useEffect, useRef } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Login } from '@/entities/member/api'
import { LowercaseOAuthType } from '@/entities/member/model'

import { Loading } from '@/shared/components'
import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { useOAuthStateStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'

import * as S from './styles'

interface LoginPageProps {
  authorized?: string | string[] | undefined
  isExpired?: boolean
}

export const LoginPage = ({ authorized, isExpired }: LoginPageProps) => {
  const { toast } = useToast()

  const { setState } = useOAuthStateStore()

  const isUnauthorized: boolean = authorized !== undefined

  const providerRef = useRef<LowercaseOAuthType>('kakao')

  const { refetch: StartLogin, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.AUTH.LOGIN(providerRef.current),
    queryFn: () => Login(providerRef.current),
    enabled: false,
    ...QUERY_OPTIONS.MEMBER.AUTH.LOGIN,
  })

  const handleLogin = async (provider: LowercaseOAuthType) => {
    providerRef.current = provider // 현재 provider 갱신
    try {
      const { data } = await StartLogin()
      if (data?.data) {
        const { redirectUrl } = data.data

        // ✅ URL 파싱
        const parsedUrl = new URL(redirectUrl)
        const stateParam = parsedUrl.searchParams.get('state')

        // ✅ Zustand 저장
        if (stateParam) {
          setState(stateParam)
          parsedUrl.searchParams.delete('state') // state 제거
        }

        // ✅ 수정된 URL로 리디렉션
        window.location.href = parsedUrl.toString()
      }
    } catch (_error) {
      toast('Error', `${provider} 로그인 실패\n재시도 해주세요`)
    }
  }

  useEffect(() => {
    // 토큰이 만료된 경우
    if (isExpired) {
      toast('Error', '세션이 만료되었습니다\n다시 로그인해주세요')
      return
    }
    // 미인증 유저
    if (isUnauthorized) {
      console.log('execetued!')

      toast('Error', '로그인이 필요합니다')
      return
    }
  }, [authorized])

  return (
    <S.Container>
      <S.Logo width={160} height={60} />
      <S.DividerWrapper>
        <S.Line />
        <S.Text>로그인 / 회원가입</S.Text>
        <S.Line />
      </S.DividerWrapper>
      {!isLoading ? <S.KakaoImage onClick={() => handleLogin('kakao')} /> : <Loading />}
    </S.Container>
  )
}
