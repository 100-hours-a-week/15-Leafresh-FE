'use client'

import { useEffect, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'

import * as S from './styles'

interface ChallengeVerifyCarouselProps {
  images: string[]
  className?: string
}

const SLIDES_PER_PAGE = 3

export const ChallengeVerifyCarousel = ({ images, className }: ChallengeVerifyCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: SLIDES_PER_PAGE,
    containScroll: 'trimSnaps',
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi])

  const totalPages = Math.ceil(images.length / SLIDES_PER_PAGE)

  return (
    <S.Wrapper className={className}>
      <S.Viewport ref={emblaRef}>
        <S.Track>
          {images.map((url, idx) => (
            <S.Slide key={idx}>
              <S.StyledImage src={url} alt='인증 이미지' fill sizes='(max-width: 430px) 33.3vw, 200px' />
            </S.Slide>
          ))}
        </S.Track>
      </S.Viewport>

      <S.Pagination>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <S.Dot key={idx} active={idx === selectedIndex} onClick={() => emblaApi?.scrollTo(idx)} />
        ))}
      </S.Pagination>
    </S.Wrapper>
  )
}
