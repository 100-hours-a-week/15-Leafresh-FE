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

{
  /*'use client'

import React, { useCallback,useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

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
  const sliderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const translateXRef = useRef(0)
  const [renderTranslateX, setRenderTranslateX] = useState(0)
  const maxTranslateRef = useRef(0)
  const [isSliderVisible, setIsSliderVisible] = useState(false)
  const touchYRef = useRef(0)

  // 가로 이동 로직
  const handleTranslate = useCallback((delta: number) => {
    let next = translateXRef.current - delta
    if (next > 0) next = 0
    if (next < maxTranslateRef.current) next = maxTranslateRef.current
    translateXRef.current = next
    setRenderTranslateX(next)
  }, [])

  // 슬라이더 노출 비율 체크
  const checkVisibility = useCallback(() => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const vh = window.innerHeight
    const visibleTop = Math.max(rect.top, 0)
    const visibleBot = Math.min(rect.bottom, vh)
    const visibleHeight = Math.max(visibleBot - visibleTop, 0)
    setIsSliderVisible(visibleHeight / rect.height >= 0.8)
  }, [])

  // 콘텐츠 크기 계산
  useEffect(() => {
    if (!contentRef.current || !sliderRef.current) return
    const width = contentRef.current.scrollWidth
    const container = sliderRef.current.clientWidth
    maxTranslateRef.current = -(width - container)
  }, [images])

  // 스크롤/리사이즈 트리거
  useEffect(() => {
    checkVisibility()
    window.addEventListener('scroll', checkVisibility)
    window.addEventListener('resize', checkVisibility)
    return () => {
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [checkVisibility])

  // 휠 이벤트만 window에 바인딩
  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      if (!isSliderVisible || !sliderRef.current) return
      const { top, bottom } = sliderRef.current.getBoundingClientRect()
      if (e.clientY < top || e.clientY > bottom) return
      const atLeft = translateXRef.current === 0
      const atRight = translateXRef.current === maxTranslateRef.current
      const down = e.deltaY > 0
      const hijack = (down && !atRight) || (!down && !atLeft)
      if (!hijack) return
      e.preventDefault()
      handleTranslate(down ? 30 : -30)
    }
    window.addEventListener('wheel', wheelHandler, { passive: false })
    return () => {
      window.removeEventListener('wheel', wheelHandler)
    }
  }, [isSliderVisible, handleTranslate])

  // 터치 핸들러 (컨테이너에 직접 할당)
  const onTouchStart = (e: React.TouchEvent) => {
    touchYRef.current = e.touches[0].clientY
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isSliderVisible || !sliderRef.current) return
    const { top, bottom } = sliderRef.current.getBoundingClientRect()
    if (touchYRef.current < top || touchYRef.current > bottom) return
    const currentY = e.touches[0].clientY
    const diff = currentY - touchYRef.current
    if (Math.abs(diff) < 10) return
    e.preventDefault()
    // 상하 스와이프 → 가로 이동 (방향 반전)
    handleTranslate(diff > 0 ? -30 : 30)
    touchYRef.current = currentY
  }

  return (
    <SliderSection ref={sliderRef}>
      <SlideContainer onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
        <SlideContent ref={contentRef} translateX={renderTranslateX}>
          {images.map((img, i) => (
            <ImageContainer key={i}>
              <StyledImage src={img.url} alt={`슬라이드 ${i + 1}`} />
            </ImageContainer>
          ))}
        </SlideContent>
      </SlideContainer>
    </SliderSection>
  )
}

export default ChallengeImageSlider

const SliderSection = styled.div`
  position: relative;
  width: 100%;
  margin-top: 40px;
  padding-bottom: 40px;
`

const SlideContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
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
`*/
}

/* -------비상 상황 대비 메인 페이지 슬라이더------------ 
import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

// 이미지 타입 정의
interface ImageType {
  url: string
}

// Props 타입 정의
interface ChallengeImageSliderProps {
  images: ImageType[]
}

// scrollPosition을 받는 컴포넌트를 위한 타입 정의
interface SlideContentProps {
  scrollPosition: number
}

const ChallengeImageSlider: React.FC<ChallengeImageSliderProps> = ({ images = [] }) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const previousScrollY = useRef(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderSectionRef = useRef<HTMLDivElement>(null)

  // 초기 오프셋 설정 (왼쪽에서 떨어진 거리)
  const initialOffset = 40 // 왼쪽에서 떨어진 거리(px)

  useEffect(() => {
    // 초기 위치 설정
    setScrollPosition(initialOffset)

    // 최초 설정
    const initScroll = () => {
      if (sliderSectionRef.current) {
        previousScrollY.current = window.scrollY
      }
    }

    initScroll()

    // 슬라이더가 화면 하단에 도달했는지 확인하는 함수
    const checkIfBottomVisible = () => {
      if (!sliderSectionRef.current) return false

      const rect = sliderSectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight

      // 요소가 화면의 하단에 접근하거나 이미 보이는 경우 (하단 30% 영역)
      return rect.top <= windowHeight * 0.7
    }

    const handleScroll = () => {
      // 슬라이더가 화면 하단에 도달했는지 확인
      const bottomVisible = checkIfBottomVisible()

      // 활성화 상태 변경
      if (bottomVisible && !isActive) {
        setIsActive(true)
        previousScrollY.current = window.scrollY
      } else if (!bottomVisible && isActive) {
        setIsActive(false)
      }

      // 활성화되지 않았다면 스크롤 처리 건너뛰기
      if (!isActive) return

      const currentScrollY = window.scrollY
      const scrollDifference = currentScrollY - previousScrollY.current

      // 슬라이더 이동량 계산 (민감도 조절 가능)
      const sensitivity = 1.0 // 민감도 조절 가능
      const moveAmount = scrollDifference * sensitivity

      // 스크롤 위치 업데이트 (음수는 왼쪽으로, 양수는 오른쪽으로 이동)
      setScrollPosition(prev => {
        // 콘텐츠와 컨테이너의 너비 계산
        const contentWidth = contentRef.current?.scrollWidth || 0
        const containerWidth = containerRef.current?.clientWidth || 0
        const maxScroll = -(contentWidth - containerWidth - initialOffset) // 초기 오프셋 고려

        // 새 위치 계산
        const newPosition = prev - moveAmount

        // 경계 내에 유지 (초기 오프셋 고려)
        if (newPosition > initialOffset) return initialOffset
        if (newPosition < maxScroll) return maxScroll
        return newPosition
      })

      // 다음 비교를 위해 현재 스크롤 위치 저장
      previousScrollY.current = currentScrollY
    }

    // IntersectionObserver를 사용하여 요소가 화면 하단에 나타날 때 감지
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0]

        if (entry.isIntersecting) {
          // 요소가 보이기 시작하면 스크롤 위치 초기화
          previousScrollY.current = window.scrollY

          // 요소의 위치가 뷰포트의 어느 부분에 있는지 확인
          const rect = entry.boundingClientRect
          const windowHeight = window.innerHeight || document.documentElement.clientHeight

          // 화면 하단 30% 영역에 요소가 있는지 확인
          if (rect.top <= windowHeight * 0.7) {
            setIsActive(true)
          }
        }
      },
      {
        threshold: [0, 0.3, 0.7, 1], // 여러 임계값 설정
        rootMargin: '0px 0px -30% 0px', // 하단 30% 영역만 고려
      },
    )

    if (sliderSectionRef.current) {
      observer.observe(sliderSectionRef.current)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (sliderSectionRef.current) {
        observer.unobserve(sliderSectionRef.current)
      }
    }
  }, [isActive])

  return (
    <SliderSection ref={sliderSectionRef}>
      <SlideContainer ref={containerRef}>
        <SlideContent ref={contentRef} scrollPosition={scrollPosition}>
          {images && images.length > 0
            ? images.map((image, index) => (
                <ImageContainer key={index}>
                  <StyledImage src={image.url} alt={`챌린지 이미지 ${index + 1}`} />
                </ImageContainer>
              ))
            : Array(3)
                .fill(null)
                .map((_, index) => (
                  <ImageContainer key={index}>
                    <StyledSvg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                      <circle cx='8.5' cy='8.5' r='1.5' />
                      <polyline points='21 15 16 10 5 21' />
                    </StyledSvg>
                  </ImageContainer>
                ))}
        </SlideContent>
      </SlideContainer>
    </SliderSection>
  )
}

export default ChallengeImageSlider

// 슬라이더 섹션 컨테이너
const SliderSection = styled.div`
  width: 100%;
  margin-top: 40px;
  position: relative;
  min-height: 300px; // 최소 높이 설정
  padding-bottom: 40px;
`

// 전체 슬라이딩 갤러리 컨테이너
const SlideContainer = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  position: relative;
`

// 가로로 스크롤 가능한 콘텐츠
const SlideContent = styled.div<SlideContentProps>`
  display: flex;
  transition: transform 0.3s ease-out;
  transform: translateX(${props => props.scrollPosition}px);
  padding-left: 40px;
`

// 개별 이미지 컨테이너 - 사진과 유사하게 크기 조정
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
  background-color: #f9f9f9;

  &:first-of-type {
    margin-left: 0;
  }
`

// 이미지 스타일링을 위한 컴포넌트
const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

// 플레이스홀더 아이콘 스타일링 (빈 상태용)
const StyledSvg = styled.svg`
  width: 48px;
  height: 48px;
  color: #ccc;
`
*/
