'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

import VerificationStatusCard from '../../verification-status-card/ui/verification-status-card'
import { carousel_options } from '../model/consts'
import { chunkArray } from '../model/lib'
import { VerificationCarouselProps } from '../model/types'
import * as S from './styles'

const VerificationCarousel = ({ verifications }: VerificationCarouselProps) => {
  // Fix 1: Use the correct type for containScroll ('trimSnaps' is a valid value but needs to be properly typed)
  // dragFree를 false로 설정하여 스와이프당 한 슬라이드만 이동하게 함
  // skipSnaps를 false로 설정하여 중간 스냅 지점을 건너뛰지 않도록 함

  const [emblaRef, emblaApi] = useEmblaCarousel(carousel_options)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const chunks = chunkArray(verifications, 4)

  // 스크롤 스냅 위치를 가져오는 함수
  const onInit = useCallback(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [emblaApi])

  // 현재 선택된 인덱스를 업데이트하는 함수
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // 특정 인덱스로 스크롤하는 함수
  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return
      // scrollProgress 옵션을 false로 설정하여 한 번에 한 슬라이드씩만 이동하도록 함
      emblaApi.scrollTo(index, false)
    },
    [emblaApi],
  )

  // Embla 초기화 및 이벤트 리스너 등록
  useEffect(() => {
    if (!emblaApi) return

    onInit()
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onInit)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onInit, onSelect])

  return (
    <div>
      <S.CarouselViewport ref={emblaRef}>
        <S.CarouselContainer>
          {chunks.map((group, index) => (
            <S.Slide key={index}>
              <S.Grid>
                {group.map(v => (
                  <VerificationStatusCard key={v.day} day={v.day} imageUrl={v.imageUrl} status={v.status} />
                ))}
              </S.Grid>
            </S.Slide>
          ))}
        </S.CarouselContainer>
      </S.CarouselViewport>

      <S.Dots>
        {scrollSnaps.map((_, index) => (
          <S.Dot
            key={index}
            isActive={index === selectedIndex}
            onClick={() => scrollTo(index)}
            // Fix 2: Remove canScrollTo check as it doesn't exist in Embla API
            // Instead, we'll always allow clicking the dots since the API will handle the scrolling
            disabled={false}
          />
        ))}
      </S.Dots>
    </div>
  )
}

export default VerificationCarousel
