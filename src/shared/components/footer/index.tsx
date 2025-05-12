'use client'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'
interface FooterProps {
  padding: number
}
const Footer = ({ padding }: FooterProps) => {
  return (
    <Container padding={padding}>
      <Title>고객센터</Title>
      <ContactButtons>
        <ContactButton>카카오채널 문의</ContactButton>
        <ContactButton>인스타그램 문의</ContactButton>
      </ContactButtons>
      <Links>
        <span>이용안내</span>
        <span>이용약관</span>
        <span>서비스소개</span>
        <span>개인정보 처리방침</span>
      </Links>
      <Divider />
      <Address>경기도 성남시 분당구 대왕판교로 660 유스페이스 1 A동 405호 카카오테크 부트캠프 교육장</Address>
      <Copyright>© Leafresh All Rights Reserved</Copyright>
    </Container>
  )
}

export default Footer

const Container = styled.footer<{ padding: number }>`
  width: 100%;

  position: relative;
  background-color: ${theme.colors.lfInputBackground.base};
  padding: ${({ padding }) => `24px ${padding}px`};
  padding-bottom: 32px;
  text-align: center;
  color: ${theme.colors.lfBlack.base};
`

const Title = styled.h3`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.regular};
  margin-bottom: 16px;
  text-align: left;
`

const ContactButtons = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`

const ContactButton = styled.button`
  width: 50%;
  padding: 16px 16px;
  border: 1px solid ${theme.colors.lfGray.base};
  border-radius: ${theme.radius.base};
  background-color: ${theme.colors.lfWhite.base};
  color: ${theme.colors.lfBlack.base};
  font-size: ${theme.fontSize.xs};
  cursor: pointer;
`

const Links = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  color: ${theme.colors.lfDarkGray.base};
  font-weight: ${theme.fontWeight.regular};
  gap: 8px;
  row-gap: 20px;
  margin-bottom: 24px;
  font-size: ${theme.fontSize.xs};
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${theme.colors.lfGray.base};
  margin-bottom: 16px;
`

const Address = styled.p`
  font-size: ${theme.fontSize.xss};
  margin-bottom: 8px;
  white-space: pre-line;
`

const Copyright = styled.p`
  font-size: ${theme.fontSize.xss};
`
