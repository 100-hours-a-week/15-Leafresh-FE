'use client'

import { ReactNode } from 'react'

import styled from '@emotion/styled'

import { LogoCharacterImage } from '@/shared/assets'
import { theme } from '@/shared/config'

interface NoContentProps {
  title: string
  buttonText: string // 버튼에 들어갈 텍스트
  clickHandler: () => void
  className?: string
}

export const NoContent = ({ title, buttonText, clickHandler, className }: NoContentProps): ReactNode => {
  return (
    <EmptyWrapper className={className}>
      <NoContentImage />
      <NoChallengeMessage>{title}</NoChallengeMessage>
      <CreateButton onClick={clickHandler}>{buttonText}</CreateButton>
    </EmptyWrapper>
  )
}

const EmptyWrapper = styled.div`
  width: 100%;
  flex: 1; // height 대신 부모 기준으로 확장
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

const NoContentImage = styled(LogoCharacterImage)`
  align-self: center;
  display: flex;
`

const NoChallengeMessage = styled.div`
  margin-top: 10px;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
  white-space: pre-line;
  text-align: center;
`

const CreateButton = styled.button`
  width: 60%;
  max-width: 320px;
  padding: 16px 32px;

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
