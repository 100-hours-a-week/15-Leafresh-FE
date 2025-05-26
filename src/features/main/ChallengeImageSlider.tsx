'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useScrollTrigger } from './hook/useScrollTrigger'
import styled from '@emotion/styled'
import { Global, css } from '@emotion/react'

interface ImageType {
  url: string
}
interface ChallengeImageSliderProps {
  images: ImageType[]
}
interface SlideContentProps {
  translateX: number
}

const ChallengeImageSlider: React.FC<ChallengeImageSliderProps> = ({ images = [] }) => {
  useScrollTrigger('.slider-trigger')

  const sliderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const translateXRef = useRef(0)
  const [renderTranslateX, setRenderTranslateX] = useState(0)
  const maxTranslateRef = useRef(0)
  const [isSliderVisible, setIsSliderVisible] = useState(false)
  const touchYRef = useRef(0)
  const [canScrollY, setCanScrollY] = useState(true)

  const handleTranslate = useCallback((delta: number) => {
    let next = translateXRef.current - delta
    next = Math.min(0, Math.max(next, maxTranslateRef.current))
    translateXRef.current = next
    setRenderTranslateX(next)

    // 슬라이더 끝 계산
    const atLeftEdge = next === 0
    const atRightEdge = next === maxTranslateRef.current
    setCanScrollY(atLeftEdge || atRightEdge)
  }, [])

  const checkVisibility = useCallback(() => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const vh = window.innerHeight
    const visible = (Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / rect.height
    setIsSliderVisible(visible >= 0.8)
  }, [])

  useEffect(() => {
    if (!contentRef.current || !sliderRef.current) return
    const width = contentRef.current.scrollWidth
    const container = sliderRef.current.clientWidth
    maxTranslateRef.current = -(width - container)
  }, [images])

  useEffect(() => {
    checkVisibility()
    window.addEventListener('scroll', checkVisibility)
    window.addEventListener('resize', checkVisibility)
    return () => {
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [checkVisibility])

  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      if (!isSliderVisible || !sliderRef.current) return
      const { top, bottom } = sliderRef.current.getBoundingClientRect()
      if (e.clientY < top || e.clientY > bottom) return
      const atLeft = translateXRef.current === 0
      const atRight = translateXRef.current === maxTranslateRef.current
      const down = e.deltaY > 0
      if ((down && !atRight) || (!down && !atLeft)) {
        e.preventDefault()
        handleTranslate(down ? 60 : -60)
      }
    }
    window.addEventListener('wheel', wheelHandler, { passive: false })
    return () => {
      window.removeEventListener('wheel', wheelHandler)
    }
  }, [isSliderVisible, handleTranslate])

  const onTouchStart = (e: React.TouchEvent) => {
    touchYRef.current = e.touches[0].clientY
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isSliderVisible || !sliderRef.current) return
    const { top, bottom } = sliderRef.current.getBoundingClientRect()
    // 슬라이더 영역 밖이면 무시
    if (touchYRef.current < top || touchYRef.current > bottom) return

    const currentY = e.touches[0].clientY
    const diff = currentY - touchYRef.current
    if (Math.abs(diff) < 10) return

    const atLeftEdge = translateXRef.current >= 0
    const atRightEdge = translateXRef.current <= maxTranslateRef.current

    if ((atLeftEdge && diff > 0) || (atRightEdge && diff < 0)) {
      touchYRef.current = currentY
      return
    }

    // 그 외의 경우에는 가로 이동
    e.preventDefault()
    handleTranslate(diff > 0 ? -30 : 30)
    touchYRef.current = currentY
  }

  return (
    <>
      <Global
        styles={css`
          .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition:
              opacity 0.6s ease-out,
              transform 0.6s ease-out;
          }
          .animate-on-scroll.visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}
      />

      <SliderSection ref={sliderRef} className='slider-trigger animate-on-scroll'>
        <SlideContainer onTouchStart={onTouchStart} onTouchMove={onTouchMove} canScrollY={canScrollY}>
          <SlideContent ref={contentRef} translateX={renderTranslateX}>
            {images.map((img, i) => (
              <ImageContainer key={i}>
                <StyledImage src={img.url} alt={`슬라이드 ${i + 1}`} />
              </ImageContainer>
            ))}
          </SlideContent>
        </SlideContainer>
      </SliderSection>
    </>
  )
}

export default ChallengeImageSlider

/* ===== 스타일 ===== */
const SliderSection = styled.div`
  position: relative;
  width: 100%;
  margin-top: 40px;
  padding-bottom: 40px;
`

const SlideContainer = styled.div<{ canScrollY: boolean }>`
  width: 100%;
  overflow: hidden;
  position: relative;
  /* canScrollY 가 true일 때만 pan-y (세로 스크롤) 허용 */
  touch-action: ${({ canScrollY }) => (canScrollY ? 'pan-y' : 'none')};
  overscroll-behavior: contain;
`

const SlideContent = styled.div<SlideContentProps>`
  display: flex;
  transform: translateX(${p => p.translateX}px);
  transition: transform 0.2s ease-out;
  padding-left: 40px;
`

const ImageContainer = styled.div`
  min-width: 280px;
  height: 380px;
  margin-right: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  background: #f9f9f9;
`

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
