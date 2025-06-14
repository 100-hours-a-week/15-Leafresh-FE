import useEmblaCarousel from 'embla-carousel-react'
import { ScrollIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import { PersonalChallengeType } from '@entities/challenge/api/personal/get-personal-list'
import { URL } from '@shared/constants/route/route'

import { PersonalChallengeSectionProps } from '../model/types'
import * as S from './styles'

import { CardDescription, CardTitle } from '@chakra-ui/react'
import { sendGAEvent } from '@next/third-parties/google'
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
            {personalChallenges.map(ch => (
              <S.EmblaSlide key={ch.id}>
                <S.DailyCard>
                  <S.DailyImageArea>
                    <S.DailyImage src={ch.thumbnailUrl} alt={ch.description} fill />
                  </S.DailyImageArea>
                  <S.DailyCardDescriptions>
                    <CardTitle>{ch.title}</CardTitle>
                    <CardDescription>{ch.description}</CardDescription>
                    <S.JoinButton onClick={() => handleClickCard(ch)}>자세히 보기</S.JoinButton>
                  </S.DailyCardDescriptions>
                </S.DailyCard>

                <S.StyledLeafReward reward={ch.leafReward} />
              </S.EmblaSlide>
            ))}
          </S.EmblaSlideContainer>
        </S.EmblaContainer>

        <S.LeftIconWrapper onClick={() => emblaApi?.scrollPrev()}>
          <ScrollIcon name='ChevronLeft' size={24} />
        </S.LeftIconWrapper>

        <S.RightIconWrapper onClick={() => emblaApi?.scrollNext()}>
          <ScrollIcon name='ChevronRight' size={24} />
        </S.RightIconWrapper>
      </S.CarouselWrapper>
    </S.Section>
  )
}
