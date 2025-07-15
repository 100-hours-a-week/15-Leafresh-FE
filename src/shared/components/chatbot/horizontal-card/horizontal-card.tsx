'use client'

import React from 'react'

import { SlideArea } from '../../slidearea'

import * as S from './styles'

interface HorizontalCardsProps {
  visibleIndex: number
  // ChatFrame에서 전달할 렌더러: 카드 컴포넌트를 배열로 반환하는 함수
  renderCards: () => React.ReactNode[]
}

export const HorizontalCards = ({ visibleIndex, renderCards }: HorizontalCardsProps) => {
  return (
    <S.SlideWrapper>
      <SlideArea visibleIndex={visibleIndex}>
        {renderCards().map((card, idx) => (
          <React.Fragment key={idx}>{card}</React.Fragment>
        ))}
      </SlideArea>
    </S.SlideWrapper>
  )
}
