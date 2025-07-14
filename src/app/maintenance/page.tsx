'use client'

import styled from '@emotion/styled'

import ServiceReadyImage from '@/shared/assets/images/service_ready.svg'
import { media, theme } from '@/shared/config'

export default function ServiceReady() {
  return (
    <Wrapper>
      <ImageWrapper>
        <ServiceReadyImage style={{ width: '100%', height: '100%' }} />
      </ImageWrapper>
      <TitleWrapper>
        <Title>더 나은 서비스를 제공하기 위해</Title>
        <Title>잠시 쉬어가고 있어요</Title>
      </TitleWrapper>
      <Description>지구처럼, Leafresh도 쉬어가는 시간이 필요하답니다</Description>
    </Wrapper>
  )
}

// === Styles ===

const Wrapper = styled.section`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 60px 20px;
  text-align: center;
  gap: 28px;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 358px;

  ${media.afterMobile} {
    width: 400px;
    height: 476px;
  }
`
const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.lfBlack.base};

  ${media.afterMobile} {
    font-size: 30px;
  }
  ${media.afterTablet} {
    font-size: 40px;
  }
`

const Description = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfDarkGray.base};
  white-space: pre-line;

  padding: 12px 0;
  ${media.afterMobile} {
    font-size: ${theme.fontSize.lg};
  }
  ${media.afterTablet} {
    font-size: ${theme.fontSize.xl};
  }
`
