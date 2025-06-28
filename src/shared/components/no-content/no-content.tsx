'use client'

import { ReactNode } from 'react'

import Image from 'next/image'

import LogoCharacterImage from '@public/image/main-icon.svg'

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
      <Image src={LogoCharacterImage} alt='로고 캐릭터' />
      <S.NoChallengeMessage>{title}</S.NoChallengeMessage>
      <S.CreateButton onClick={clickHandler}>{buttonText}</S.CreateButton>
    </S.EmptyWrapper>
  )
}
