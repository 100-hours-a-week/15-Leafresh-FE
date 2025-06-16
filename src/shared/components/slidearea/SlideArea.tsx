'use client'

import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

interface SlideAreaProps {
  children: React.ReactNode[]
  className?: string
  visibleIndex: number // 어디까지 보여줄지 제어하는 인덱스
  onItemSelect?: (index: number) => void // 아이템 선택 시 콜백
}

export default function SlideArea({ children, className, visibleIndex, onItemSelect }: SlideAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // visibleIndex가 변경되면 해당 아이템으로 스크롤
  useEffect(() => {
    if (!scrollRef.current) return

    const itemElements = scrollRef.current.querySelectorAll<HTMLElement>('[data-slide-item]')
    // 배열 범위를 벗어나지 않도록 인덱스를 제한
    const idx = Math.min(visibleIndex, itemElements.length - 1)
    const target = itemElements[idx]
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
      })
    }
  }, [visibleIndex])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return

    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const stopDragging = () => {
    setIsDragging(false)
  }

  // 터치 이벤트 처리 (모바일 환경)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return

    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return

    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  // 이벤트 리스너 등록 및 해제
  useEffect(() => {
    const handleMouseUp = () => {
      stopDragging()
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

  // 자식 요소가 없으면 아무것도 렌더링하지 않음
  if (!children || React.Children.count(children) === 0) {
    return null
  }

  // 필터링된 자식 요소들
  const childrenArray = React.Children.toArray(children)

  return (
    <SlideContainer
      className={className}
      ref={scrollRef}
      isDragging={isDragging}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={stopDragging}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDragging}
    >
      <SlideItem data-slide-item={0} key={0}>
        {childrenArray[0]}
      </SlideItem>

      {childrenArray.slice(1).map((child, index) => {
        const actualIndex = index + 1
        return actualIndex <= visibleIndex ? (
          <SlideItem data-slide-item={actualIndex} key={actualIndex}>
            {child}
          </SlideItem>
        ) : null
      })}
    </SlideContainer>
  )
}

const SlideContainer = styled.div<{ isDragging: boolean }>`
  display: flex;
  scroll-behavior: smooth;
  gap: 5px;
  user-select: none;

  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`

const SlideItem = styled.div`
  flex: 0 0 auto;
  width: auto;
  min-width: min-content;
  transition:
    opacity 1s ease,
    transform 1s ease;
  scroll-snap-align: start;
`
