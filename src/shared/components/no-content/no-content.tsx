'use client'

import { ReactNode } from 'react'

import * as S from './styles'

interface NoContentProps {
  title: string
  buttonText: string // 버튼에 들어갈 텍스트
  clickHandler: () => void
  className?: string
}

export const NoContent = ({ title, buttonText, clickHandler, className }: NoContentProps): ReactNode => {
  return (
    <S.EmptyWrapper className={className}>
      <S.NoContentImage />
      <S.NoChallengeMessage>{title}</S.NoChallengeMessage>
      <S.CreateButton onClick={clickHandler}>{buttonText}</S.CreateButton>
    </S.EmptyWrapper>
  )
}
