'use client'

import { useEffect, useRef } from 'react'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { Login } from '@/entities/member/api'
import { LowercaseOAuthType } from '@/entities/member/model'

import { Loading } from '@/shared/components'
import { QUERY_KEYS, QUERY_OPTIONS, theme } from '@/shared/config'
import { useOAuthStateStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'

import KakaoLoginButton from '@public/image/kakao_login.svg'
import LogoImage from '@public/image/logo.svg'

const LoginPage = () => {
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const { setState } = useOAuthStateStore()

  const isExpired = searchParams.get('expired') === 'true'

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
      toast('Error', `로그인 실패\n재시도 해주세요`)
    }
  }

  useEffect(() => {
    if (isExpired) {
      toast('Error', '세션이 만료되었습니다\n다시 로그인해주세요')
    }
  }, [isExpired])

  return (
    <Container>
      <Logo src={LogoImage} alt='Leafresh' width={160} height={60} />
      <DividerWrapper>
        <Line />
        <Text>로그인 / 회원가입</Text>
        <Line />
      </DividerWrapper>
      {!isLoading ? (
        <KakaoImage src={KakaoLoginButton} alt='kakao' onClick={() => handleLogin('kakao')} />
      ) : (
        <Loading />
      )}
    </Container>
  )
}

export default LoginPage

const Container = styled.div`
  height: calc(100dvh - 60px);

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 64px 24px;
  background-color: ${theme.colors.lfWhite.base};
`

const Logo = styled(Image)`
  margin-bottom: 40px;
`

const DividerWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${theme.colors.lfGray.base};
`

const Text = styled.div`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
`

const KakaoImage = styled(Image)`
  width: 100%;
  height: 50px;
`
