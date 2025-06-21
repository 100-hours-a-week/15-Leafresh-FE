'use client'

import Image from 'next/image'
import Link from 'next/link'

import { media } from '@/shared/config'
import { URL } from '@/shared/constants'
import styled from '@emotion/styled'
import NotFoundImage from '@public/image/404.svg'
export default function NotFound() {
  return (
    <Wrapper>
      <ImageWrapper>
        <Image src={NotFoundImage} alt='404 Not Found' fill />
      </ImageWrapper>
      <Title>페이지를 찾을 수 없습니다</Title>
      <DescriptionWrapper>
        <Description>이곳은 지구를 지키기 어려운 길이네요.</Description>
        <Description>나무를 심으러 돌아가볼까요?</Description>
      </DescriptionWrapper>

      <HomeButton href={URL.MAIN.INDEX.value}>홈으로 돌아가기</HomeButton>
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
  gap: 20px;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 433px;
  height: 300px;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.lfBlack.base};

  ${media.afterMobile} {
    font-size: 32px;
  }
`

const DescriptionWrapper = styled.div`
  margin-top: 12px;

  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 16px;

  ${media.afterMobile} {
    font-size: 20px;
  }
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  white-space: pre-line;
`

const HomeButton = styled(Link)`
  margin-top: 16px;
  padding: 18px 32px;
  background-color: ${({ theme }) => theme.colors.lfGreenDark.base};
  color: #d0ddb4;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenDark.hover};
  }

  ${media.afterMobile} {
    font-size: 18px;
    padding: 24px 32px;
  }
`
