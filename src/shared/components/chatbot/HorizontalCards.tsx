'use client'

import React from 'react'
import styled from '@emotion/styled'

import SlideArea from '@shared/components/slidearea/SlideArea'

import ChatSelection from './ChatSelection'

interface HorizontalCardsProps {
  visibleIndex: number
  // ChatFrame에서 전달할 렌더러: 카드 컴포넌트를 배열로 반환하는 함수
  renderCards: HorizonCardType[]
}

type HorizonCardType = {
  key: string
  selectionType: 'location' | 'workType'
  title: string
  subtitle: string
  imageUrl: string
  onSelect: (value: string) => void
}

export default function HorizontalCards({ visibleIndex, renderCards }: HorizontalCardsProps) {
  return (
    <SlideWrapper>
      <SlideArea visibleIndex={visibleIndex}>
        {renderCards.map(({ key, selectionType, title, subtitle, imageUrl, onSelect }) => (
          <ChatSelection
            key={key}
            selectionType={selectionType}
            title={title}
            subtitle={subtitle}
            imageUrl={imageUrl}
            onSelect={onSelect}
          />
        ))}
      </SlideArea>
    </SlideWrapper>
  )
}

const SlideWrapper = styled.div`
  margin: 8px 0;
  /* padding-left: 40px; */
  width: 100%;
`
