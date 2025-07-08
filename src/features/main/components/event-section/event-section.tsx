'use client'

import { ReactNode, useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { sendGAEvent } from '@next/third-parties/google'

import styled from '@emotion/styled'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { EventChallenge } from '@/entities/challenge/api'

import { media } from '@/shared/config'
import { ASPECT_RATIOS, URL } from '@/shared/constants'
import { responsiveHorizontalPadding } from '@/shared/styles'

interface EventSectionProps {
  eventChallenges: EventChallenge[]
  className?: string
}

export const EventSection = ({ eventChallenges, className }: EventSectionProps): ReactNode => {
  const router = useRouter()
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })],
  )

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi])

  const handleClickCard = (ch: EventChallenge) => {
    sendGAEvent('event', 'event-card', { challengeId: ch.id }) // GA: 로그 수집

    router.push(URL.CHALLENGE.GROUP.DETAILS.value(ch.id))
  }

  return (
    <Section>
      <CarouselWrapper ref={emblaRef}>
        <CarouselInner>
          {eventChallenges.length !== 0 ? (
            eventChallenges.map(ch => (
              <EventCard key={ch.id} onClick={() => handleClickCard(ch)}>
                <EventImage src={ch.thumbnailUrl} alt={ch.description} fill />
                <EventGradientOverlay />
                <EventTitleOverlay>{ch.title}</EventTitleOverlay>
                <Badge className='badge'>이벤트 챌린지</Badge>
              </EventCard>
            ))
          ) : (
            <NoneContent>진행중인 이벤트 챌린지가 없습니다 !</NoneContent>
          )}
        </CarouselInner>

        {eventChallenges.length > 0 && (
          <CarouselIndicator>
            {selectedIndex + 1} / {eventChallenges.length}
          </CarouselIndicator>
        )}
      </CarouselWrapper>
    </Section>
  )
}

// === Styles ===

const Section = styled.section`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;

  &:hover {
    .badge {
      opacity: 1;
    }
  }
`

const Badge = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 12px 12px;
  background: ${({ theme }) => theme.colors.lfGreenMain.base};
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: opacity 0.3s ease;

  z-index: 10;
`

const CarouselWrapper = styled.div`
  width: 100%;
  /* height: 160px; */
  aspect-ratio: ${ASPECT_RATIOS.CHALLENGE.THUMBNAIL};

  position: relative;
  overflow: hidden;
`

const CarouselInner = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
`
const EventCard = styled.div`
  margin-right: 8px;
  flex: 0 0 100%;
  height: 100%;

  background: ${({ theme }) => theme.colors.lfInputBackground.base};
  border-radius: ${({ theme }) => theme.radius.base};
  display: flex;
  flex-direction: row;
  position: relative;

  overflow: hidden;
  gap: 12px;

  cursor: pointer;
`

const EventImage = styled(Image)`
  position: absolute;
  top: 0;
  object-fit: cover;
  object-position: center center;
  border-radius: ${({ theme }) => theme.radius.base};
`
const EventGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0.8) 100%);
  border-radius: ${({ theme }) => theme.radius.base};
`

const EventTitleOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
  pointer-events: none;
`

const NoneContent = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`

const CarouselIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  right: 12px;

  background-color: rgba(0, 0, 0, 0.5);
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
`
