'use client'
import { ReactNode } from 'react'

import { Introduce } from '@/features/main/components'

import { FeedBackLinkButton } from '@/shared/components'

import * as S from './styles'

export const GlobalWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <S.EntirePageLayout>
      <Introduce />
      <S.ContentWrapper>{children}</S.ContentWrapper>
      <FeedBackLinkButton />
    </S.EntirePageLayout>
  )
}
