'use client'

import { ReactNode, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { sendGAEvent } from '@next/third-parties/google'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { EventChallenge } from '@/entities/challenge/api'

import { URL } from '@/shared/constants'

import * as S from './styles'

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
    <S.Section>
      <S.CarouselWrapper ref={emblaRef}>
        <S.CarouselInner>
          {eventChallenges.length !== 0 ? (
            eventChallenges.map((ch, index) => (
              <S.EventCard key={ch.id} onClick={() => handleClickCard(ch)}>
                <S.EventImage
                  src={ch.thumbnailUrl}
                  alt={ch.description}
                  fill
                  sizes='(max-width: 430px)100vw, 430px'
                  priority={index === 0}
                />
                <S.EventGradientOverlay />
                <S.EventTitleOverlay>{ch.title}</S.EventTitleOverlay>
                <S.Badge className='badge'>이벤트 챌린지</S.Badge>
              </S.EventCard>
            ))
          ) : (
            <S.NoneContent>진행중인 이벤트 챌린지가 없습니다 !</S.NoneContent>
          )}
        </S.CarouselInner>

        {eventChallenges.length > 0 && (
          <S.CarouselIndicator>
            {selectedIndex + 1} / {eventChallenges.length}
          </S.CarouselIndicator>
        )}
      </S.CarouselWrapper>
    </S.Section>
  )
}
