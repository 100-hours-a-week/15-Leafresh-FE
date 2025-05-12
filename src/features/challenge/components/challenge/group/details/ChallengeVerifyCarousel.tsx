'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

interface ChallengeVerifyCarouselProps {
  images: string[]
  className?: string
}

const SLIDES_PER_PAGE = 3

const ChallengeVerifyCarousel = ({ images, className }: ChallengeVerifyCarouselProps) => {
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
              <StyledImage src={url} alt='인증 이미지' fill />
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

export default ChallengeVerifyCarousel

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
`

const Viewport = styled.div`
  overflow: hidden;
  width: 100%;
`

const Track = styled.div`
  display: flex;
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
