'use client'

import Image from 'next/image'

import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'
import KakaoLoginButton from '@public/image/kakao_login.svg'
import LogoImage from '@public/image/logo.svg'

const LoginPage = () => {
  const loginHandler = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`
  }

  return (
    <Container>
      <Logo src={LogoImage} alt='Leafresh' width={160} height={60} />
      <DividerWrapper>
        <Line />
        <Text>로그인 / 회원가입</Text>
        <Line />
      </DividerWrapper>
      <KakaoImage src={KakaoLoginButton} alt='kakao' onClick={loginHandler} />
    </Container>
  )
}

export default LoginPage

const Container = styled.div`
  height: 100%;

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
