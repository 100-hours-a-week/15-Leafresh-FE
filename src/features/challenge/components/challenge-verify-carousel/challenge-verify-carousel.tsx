'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'
import useEmblaCarousel from 'embla-carousel-react'

import { theme } from '@/shared/config'

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
    <Wrapper className={className}>
      <Viewport ref={emblaRef}>
        <Track>
          {images.map((url, idx) => (
            <Slide key={idx}>
              <StyledImage src={url} alt='인증 이미지' fill sizes='(max-width: 640px) 33.3vw, 200px' />
            </Slide>
          ))}
        </Track>
      </Viewport>

      <Pagination>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <Dot key={idx} active={idx === selectedIndex} onClick={() => emblaApi?.scrollTo(idx)} />
        ))}
      </Pagination>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const Viewport = styled.div`
  overflow: hidden;
  width: 100%;
`

const Track = styled.div`
  display: flex;
  gap: 8px;
`

const Slide = styled.div`
  position: relative;
  flex: 0 0 33.3%;
  aspect-ratio: 1 / 1;
  padding: 4px;
  cursor: pointer;
`

const StyledImage = styled(Image)`
  object-fit: cover;
  border-radius: ${theme.radius.base};
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
`

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background-color: ${({ active }) => (active ? theme.colors.lfGreenMain.base : theme.colors.lfLightGray.base)};
  cursor: pointer;
`
