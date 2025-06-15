import Image from 'next/image'
import { ReactNode } from 'react'

import ApologizeImage from '@public/image/apologize_character.svg'

import * as S from './styles'

interface ApologizeContentProps {
  title: string
  description: string
  className?: string
}

export const ApologizeContent = ({ title, description, className }: ApologizeContentProps): ReactNode => {
  return (
    <S.EmptySection>
      <Image src={ApologizeImage} alt='사죄 이미지' width={140} height={140} />
      <S.EmptyTitle>{title}</S.EmptyTitle>
      <S.EmptyDescription>{description}</S.EmptyDescription>
      <S.EmptyDescription>감사합니다.</S.EmptyDescription>
    </S.EmptySection>
  )
}
