'use client'

import { ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { sendGAEvent } from '@next/third-parties/google'

import useEmblaCarousel from 'embla-carousel-react'

import { PersonalChallengeType } from '@/entities/challenge/api'

import { URL } from '@/shared/constants'

import * as S from './styles'

interface PersonalChallengeSectionProps {
  personalChallenges: PersonalChallengeType[]
  className?: string
}

export const PersonalChallengeSection = ({
  personalChallenges,
  className,
}: PersonalChallengeSectionProps): ReactNode => {
  const router = useRouter()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex: 0 })

  const handleClickCard = (ch: PersonalChallengeType) => {
    sendGAEvent('event', 'personal-card', { challengeId: ch.id }) // GA: 로그 수집

    router.push(URL.CHALLENGE.PERSONAL.DETAILS.value(ch.id))
  }

  return (
    <S.Section className={className}>
      <S.SectionHeader>
        <S.SectionTitle>오늘의 챌린지</S.SectionTitle>
        <S.SubDescription>혼자서도 충분해요. 오늘 하루 도전해보세요!</S.SubDescription>
      </S.SectionHeader>

      <S.CarouselWrapper>
        <S.EmblaContainer ref={emblaRef}>
          <S.EmblaSlideContainer>
            {personalChallenges.map((ch, index) => (
              <S.EmblaSlide key={ch.id} index={index}>
                <S.DailyCard>
                  <S.DailyImageArea>
                    <S.DailyImage
                      src={ch.thumbnailUrl}
                      alt={ch.description}
                      fill
                      sizes='(max-width: 430px) 100vw, 430px'
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </S.DailyImageArea>
                  <S.DailyCardDescriptions>
                    <S.CardTitle>{ch.title}</S.CardTitle>
                    <S.CardDescription>{ch.description}</S.CardDescription>
                    <S.JoinButton onClick={() => handleClickCard(ch)}>자세히 보기</S.JoinButton>
                  </S.DailyCardDescriptions>
                </S.DailyCard>

                <S.StyledLeafReward reward={ch.leafReward} />
              </S.EmblaSlide>
            ))}
          </S.EmblaSlideContainer>
        </S.EmblaContainer>

        <S.LeftIconWrapper onClick={() => emblaApi?.scrollPrev()}>
          <S.ScrollIcon name='ChevronLeft' size={24} />
        </S.LeftIconWrapper>

        <S.RightIconWrapper onClick={() => emblaApi?.scrollNext()}>
          <S.ScrollIcon name='ChevronRight' size={24} />
        </S.RightIconWrapper>
      </S.CarouselWrapper>
    </S.Section>
  )
}
