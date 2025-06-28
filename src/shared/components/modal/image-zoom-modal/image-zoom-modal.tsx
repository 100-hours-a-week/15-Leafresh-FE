'use client'

import { useEffect, useRef, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'

import { useImageZoomStore } from '@/shared/context'
import { useKeyClose, useScrollLock } from '@/shared/hooks'

import * as S from './styles'

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
    <S.Wrapper ref={wrapperRef}>
      <S.Header>
        <span>
          {targetIndex + 1}/{IMAGE_COUNT}
        </span>
        <S.StyledLucideIcon name='X' size={20} onClick={close} />
      </S.Header>

      <S.ResultBar result={result}>{result === 'SUCCESS' ? '성공 인증샷' : '실패 인증샷'}</S.ResultBar>

      <S.Viewport ref={emblaRef}>
        <S.Container className={!isInitial ? 'animate' : ''}>
          {data.map(({ imageSrc, description }, idx) => (
            <S.Slide key={idx}>
              <S.ImageArea>
                <S.StyledImage src={imageSrc} alt='zoom-image' fill />
              </S.ImageArea>
              <S.Description>{description}</S.Description>
            </S.Slide>
          ))}
        </S.Container>
      </S.Viewport>
    </S.Wrapper>
  )
}
