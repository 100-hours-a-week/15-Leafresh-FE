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

// 슬라이드 콘텐츠 props 타입
interface SlideContentProps {
  translateX: number
}

const ChallengeImageSlider: React.FC<ChallengeImageSliderProps> = ({ images = [] }) => {
  const [translateX, setTranslateX] = useState(0)
  const [isScrollHijacked, setIsScrollHijacked] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const maxTranslateRef = useRef(0)

  useEffect(() => {
    if (!sliderRef.current || !contentRef.current || !sectionRef.current) return

    // 최대 이동 가능 거리 계산
    const contentWidth = contentRef.current.scrollWidth
    const containerWidth = sliderRef.current.clientWidth
    maxTranslateRef.current = -(contentWidth - containerWidth)

    // 스크롤 이벤트가 발생하기 전에 체크
    const wheelEventHandler = (e: WheelEvent) => {
      const sliderRect = sliderRef.current?.getBoundingClientRect()
      if (!sliderRect) return

      // 슬라이더가 화면에 보이는지 확인
      const isSliderVisible = sliderRect.top < window.innerHeight && sliderRect.bottom > 0

      if (isSliderVisible) {
        // 현재 가로 스크롤 위치
        const currentTranslateX = translateX

        // 휠 방향에 따라 이동 방향 결정
        const direction = e.deltaY > 0 ? 1 : -1

        // 이동할 거리 계산
        const moveAmount = direction * 30 // 이동 속도 조절

        // 새 위치 계산
        let newTranslateX = currentTranslateX - moveAmount

        // 경계 체크
        if (newTranslateX > 0) {
          newTranslateX = 0
        } else if (newTranslateX < maxTranslateRef.current) {
          newTranslateX = maxTranslateRef.current
        }

        // 경계에 도달했는지 확인
        const isAtLeftEdge = newTranslateX === 0 && direction === -1
        const isAtRightEdge = newTranslateX === maxTranslateRef.current && direction === 1

        // 경계에 도달하지 않았으면 스크롤 이벤트 가로채기
        if (!isAtLeftEdge && !isAtRightEdge) {
          e.preventDefault()
          setTranslateX(newTranslateX)
          setIsScrollHijacked(true)
        } else {
          // 경계에 도달했으면 하이재킹 해제
          setIsScrollHijacked(false)
        }
      } else {
        // 슬라이더가 보이지 않으면 하이재킹 해제
        setIsScrollHijacked(false)
      }
    }

    // 터치 이벤트를 위한 변수
    let touchStartX = 0
    let touchStartY = 0
    let isTouchHorizontal = false

    // 터치 시작 이벤트 핸들러
    const touchStartHandler = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      isTouchHorizontal = false
    }

    const touchMoveHandler = (e: TouchEvent) => {
      const sliderRect = sliderRef.current?.getBoundingClientRect()
      if (!sliderRect || !isTouchHorizontal) {
        // 처음 터치 방향을 결정
        const touchX = e.touches[0].clientX
        const touchY = e.touches[0].clientY
        const diffX = Math.abs(touchX - touchStartX)
        const diffY = Math.abs(touchY - touchStartY)

        // 수평 이동이 수직 이동보다 크면 수평 스와이프로 간주
        if (diffX > diffY) {
          isTouchHorizontal = true
        } else {
          return // 수직 스와이프는 처리하지 않음
        }
      }

      // 여기에서 오류가 발생한 부분
      // sliderRect가 위에서 null 체크를 했지만, 이 부분에서는 다시 체크해야 함
      if (!sliderRect) return // sliderRect가 없으면 함수 종료

      // 슬라이더가 화면에 보이는지 확인
      const isSliderVisible = sliderRect.top < window.innerHeight && sliderRect.bottom > 0

      if (isSliderVisible && isTouchHorizontal) {
        const touchX = e.touches[0].clientX
        const diffX = touchStartX - touchX

        // 새 위치 계산
        let newTranslateX = translateX - diffX * 0.5 // 이동 속도 조절

        // 경계 체크
        if (newTranslateX > 0) {
          newTranslateX = 0
        } else if (newTranslateX < maxTranslateRef.current) {
          newTranslateX = maxTranslateRef.current
        }

        e.preventDefault() // 기본 스크롤 방지
        setTranslateX(newTranslateX)

        // 다음 터치 이동의 기준점 업데이트
        touchStartX = touchX
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('wheel', wheelEventHandler, { passive: false })
    window.addEventListener('touchstart', touchStartHandler, { passive: true })
    window.addEventListener('touchmove', touchMoveHandler, { passive: false })

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('wheel', wheelEventHandler)
      window.removeEventListener('touchstart', touchStartHandler)
      window.removeEventListener('touchmove', touchMoveHandler)
    }
  }, [translateX])

  return (
    <SliderSection ref={sectionRef}>
      <SlideContainer ref={sliderRef}>
        <SlideContent ref={contentRef} translateX={translateX}>
          {images && images.length > 0
            ? images.map((image, index) => (
                <ImageContainer key={index} className='slide-item'>
                  <StyledImage src={image.url} alt={`챌린지 이미지 ${index + 1}`} />
                </ImageContainer>
              ))
            : Array(3)
                .fill(null)
                .map((_, index) => (
                  <ImageContainer key={index} className='slide-item'>
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

      {/* 스크롤 상태 표시 (개발 모드에서만 보임) */}
      {process.env.NODE_ENV === 'development' && (
        <ScrollStatus isHijacked={isScrollHijacked}>
          {isScrollHijacked ? '좌우 스크롤 중' : '페이지 스크롤 중'}
        </ScrollStatus>
      )}

      {/* 스크롤 가이드 */}
      <ScrollGuide isVisible={isScrollHijacked}>
        <ScrollIcon />
        <ScrollText>스크롤하여 더 보기</ScrollText>
      </ScrollGuide>
    </SliderSection>
  )
}

export default ChallengeImageSlider

// 슬라이더 섹션
const SliderSection = styled.div`
  position: relative;
  width: 100%;
  margin-top: 40px;
  padding-bottom: 40px;
`

// 슬라이더 컨테이너
const SlideContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`

// 가로로 스크롤되는 콘텐츠
const SlideContent = styled.div<SlideContentProps>`
  display: flex;
  transform: translateX(${props => props.translateX}px);
  transition: transform 0.2s ease-out;
  padding-left: 40px;
`

// 개별 이미지 컨테이너
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
`

// 이미지 스타일링
const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

// 플레이스홀더 SVG 스타일링
const StyledSvg = styled.svg`
  width: 48px;
  height: 48px;
  color: #ccc;
`

// 스크롤 상태 표시 (개발 모드용)
interface ScrollStatusProps {
  isHijacked: boolean
}

const ScrollStatus = styled.div<ScrollStatusProps>`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${props => (props.isHijacked ? 'rgba(76, 175, 80, 0.7)' : 'rgba(33, 150, 243, 0.7)')};
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
`

// 스크롤 가이드 컴포넌트
interface ScrollGuideProps {
  isVisible: boolean
}

const ScrollGuide = styled.div<ScrollGuideProps>`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${props => (props.isVisible ? 1 : 0)};
  transition: opacity 0.3s;
  pointer-events: none;
`

const ScrollIcon = styled.div`
  width: 20px;
  height: 30px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  position: relative;
  margin-bottom: 5px;

  &:before {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    animation: scrollAnimation 1.5s infinite;
  }

  @keyframes scrollAnimation {
    0% {
      top: 6px;
      opacity: 1;
    }
    100% {
      top: 20px;
      opacity: 0;
    }
  }
`

const ScrollText = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
`

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
