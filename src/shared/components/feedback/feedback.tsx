'use client'

import { ReactNode } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'

import { theme } from '@/shared/config'

import { ImageSource, SVGComponent } from './type'

export const Feedback = ({ children, className }: { children: ReactNode; className?: string }) => (
  <Wrapper className={className}>{children}</Wrapper>
)

const ImageComponent = ({ src }: { src: ImageSource }) => {
  if (typeof src === 'function') {
    const Svg = src as SVGComponent
    return <Svg width={140} height={140} aria-label='피드백 이미지' />
  }
  // 나머지는 Next.js Image로 렌더링
  return <Image src={src} alt='피드백 이미지' width={140} height={140} />
}

const Title = ({ text }: { text: string }) => <TitleText>{text}</TitleText>

const Description = ({ text }: { text: string }) => <DescriptionText>{text}</DescriptionText>

const Action = ({ text, clickHandler }: { text: string; clickHandler: (...args: unknown[]) => void }) => (
  <ActionWrapper onClick={clickHandler}>{text}</ActionWrapper>
)

Feedback.Image = ImageComponent
Feedback.Title = Title
Feedback.Description = Description
Feedback.Action = Action

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TitleText = styled.div`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
  margin: 16px 0 16px 0;
  text-align: center;
`

const DescriptionText = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.lfDarkGray.base};
  margin-top: 6px;
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
`

const ActionWrapper = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 16px 32px;
  display: flex;

  justify-content: center;
  align-items: center;

  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  background-color: ${theme.colors.lfGreenMain.base};
  box-shadow: ${theme.shadow.lfInput};
  color: ${theme.colors.lfWhite.base};

  border: none;
  border-radius: ${theme.radius.base};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.hover};
  }
`
