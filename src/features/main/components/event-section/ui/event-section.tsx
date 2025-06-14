'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

import { EventChallenge } from '@entities/challenge/api/event/get-event-list'
import { URL } from '@shared/constants/route/route'

import { EventSectionProps } from '../model/types'
import * as S from './styles'

import { sendGAEvent } from '@next/third-parties/google'

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
            eventChallenges.map(ch => (
              <S.EventCard key={ch.id} onClick={() => handleClickCard(ch)}>
                <S.EventImage src={ch.thumbnailUrl} alt={ch.description} fill />
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
