'use client'

import { ReactNode } from 'react'

import { ApologizeImage } from '@/shared/assets'

import * as S from './styles'

interface ApologizeContentProps {
  title: string
  description: string
  className?: string
}

export const ApologizeContent = ({ title, description, className }: ApologizeContentProps): ReactNode => {
  return (
    <S.EmptySection className={className}>
      <ApologizeImage width={140} />
      <S.EmptyTitle>{title}</S.EmptyTitle>
      <S.EmptyDescription>{description}</S.EmptyDescription>
      <S.EmptyDescription>감사합니다.</S.EmptyDescription>
    </S.EmptySection>
  )
}
