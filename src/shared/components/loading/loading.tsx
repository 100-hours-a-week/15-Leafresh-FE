/** @jsxImportSource @emotion/react */
'use client'

import { ReactNode } from 'react'

import * as S from './styles'

interface LoadingProps {
  hasText?: boolean
  className?: string
}

export const Loading = ({ hasText = true, className }: LoadingProps): ReactNode => {
  return (
    <S.Container className={className}>
      <S.DotWrapper>
        <S.Dot delay='0s' />
        <S.Dot delay='0.2s' />
        <S.Dot delay='0.4s' />
      </S.DotWrapper>
      {hasText && (
        <S.TextWrapper>
          <span>잠시만 기다려주세요</span>
        </S.TextWrapper>
      )}
    </S.Container>
  )
}
