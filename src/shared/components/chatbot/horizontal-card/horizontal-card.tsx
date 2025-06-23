'use client'

import React from 'react'

import styled from '@emotion/styled'

import { SlideArea } from '../../slidearea'

interface HorizontalCardsProps {
  visibleIndex: number
  // ChatFrame에서 전달할 렌더러: 카드 컴포넌트를 배열로 반환하는 함수
  renderCards: () => React.ReactNode[]
}

export const HorizontalCards = ({ visibleIndex, renderCards }: HorizontalCardsProps) => {
  return (
    <SlideWrapper>
      <SlideArea visibleIndex={visibleIndex}>
        {renderCards().map((card, idx) => (
          <React.Fragment key={idx}>{card}</React.Fragment>
        ))}
      </SlideArea>
    </SlideWrapper>
  )
}

const SlideWrapper = styled.div`
  margin: 8px 0;
  padding-left: 40px;
  width: 100%;
`
