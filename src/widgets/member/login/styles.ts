import styled from '@emotion/styled'

import { KakaoLoginButton, LogoImage } from '@/shared/assets'

export const Container = styled.div`
  height: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 64px 24px;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
`

export const Logo = styled(LogoImage)`
  margin-bottom: 40px;
`

export const DividerWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;

  gap: 12px;
  margin-bottom: 24px;
`

export const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lfGray.base};
`

export const Text = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

export const KakaoImage = styled(KakaoLoginButton)`
  /* width: 100%; */
  /* height: 50px; */
`
