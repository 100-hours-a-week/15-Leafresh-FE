'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { X } from 'lucide-react'
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import { ChallengeVerificationResultType } from '@entities/challenge/type'
import { theme } from '@shared/config/style/theme'
import { useImageZoomStore } from '@shared/context/modal/image-zoom-modal-store'
import { useKeyClose } from '@shared/hooks/useKeyClose/useKeyClose'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'

export const ImageZoomModal = () => {
  const [isInitial, setIsInitial] = useState(true)
  const { isOpen, close, data, targetIndex, setTargetIndex } = useImageZoomStore()

  const wrapperRef = useRef<HTMLDivElement>(null)
  useKeyClose('Escape', wrapperRef as React.RefObject<HTMLElement>, close)
  useScrollLock(isOpen)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false, // 꼭 snap 되도록
    dragFree: true, // 살짝 드래그 해도 이동
    inViewThreshold: 0.1, // 드래그 스레시홀드
  })

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.scrollTo(targetIndex, true) // 최초 진입 시 현재 인덱스 이동

    // 다음 tick보다 느리게 적용하기 위해 requestAnimationFrame 사용
    requestAnimationFrame(() => {
      setIsInitial(false)
    })

    emblaApi.on('select', () => {
      setTargetIndex(emblaApi.selectedScrollSnap())
    })

    return () => setIsInitial(true)
  }, [emblaApi, targetIndex, setTargetIndex])

  if (!isOpen || data.length === 0) return null

  const IMAGE_COUNT = data.length
  const { result } = data[targetIndex]

  return (
    <Wrapper ref={wrapperRef}>
      <Header>
        <span>
          {targetIndex + 1}/{IMAGE_COUNT}
        </span>
        <CloseIcon size={20} onClick={close} />
      </Header>

      <ResultBar result={result}>{result === 'SUCCESS' ? '성공 인증샷' : '실패 인증샷'}</ResultBar>

      <Viewport ref={emblaRef}>
        <Container className={!isInitial ? 'animate' : ''}>
          {data.map(({ imageSrc, description }, idx) => (
            <Slide key={idx}>
              <ImageArea>
                <StyledImage src={imageSrc} alt='zoom-image' fill />
              </ImageArea>
              <Description>{description}</Description>
            </Slide>
          ))}
        </Container>
      </Viewport>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  height: 100dvh;
  top: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  background-color: black;
`

const Header = styled.div`
  padding: 24px 0;

  font-size: 14px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  position: relative;

  span {
    font-size: ${theme.fontSize.base};
  }
`

const CloseIcon = styled(X)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`

const ResultBar = styled.div<{ result: ChallengeVerificationResultType }>`
  background-color: ${({ result }) => (result === 'SUCCESS' ? '#2e7d32' : '#c62828')};
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${theme.fontSize.lg};
  padding: 12px 0;
`

const Viewport = styled.div`
  width: 100%;
  overflow: hidden;

  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  background-color: black;
  flex: 1;
`

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  &.animate {
    transition: transform 0.3s ease;
  }
`
const Slide = styled.div`
  position: relative;
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ImageArea = styled.div`
  width: 100%; // 슬라이드 전체 너비
  aspect-ratio: 1 / 1; // 정사각형 유지

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const StyledImage = styled(Image)`
  object-fit: cover;
`

const Description = styled.div`
  flex: 1;
  text-align: center;
  font-size: ${theme.fontSize.base};
  background-color: black;
  color: #fff;
  padding: 30px 20px;
`
