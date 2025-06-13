'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { Login } from '@entities/member/api/login-oauth'
import { LowercaseOAuthType } from '@entities/member/type'
import Loading from '@shared/components/loading'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ToastType } from '@shared/context/toast/type'
import { useToast } from '@shared/hooks/useToast/useToast'
import { theme } from '@shared/styles/theme'
import KakaoLoginButton from '@public/image/kakao_login.svg'
import LogoImage from '@public/image/logo.svg'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

const LoginPage = () => {
  const openToast = useToast()
  const searchParams = useSearchParams()
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
        // const redirectUrl = 'https://localhost:3000/oauth/kakao/callback'

        window.location.href = redirectUrl
      }
    } catch (_error) {
      openToast(ToastType.Error, `${provider} 로그인 실패\n재시도 해주세요`)
    }
  }

  useEffect(() => {
    if (isExpired) {
      openToast(ToastType.Error, '세션이 만료되었습니다\n다시 로그인해주세요')
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
