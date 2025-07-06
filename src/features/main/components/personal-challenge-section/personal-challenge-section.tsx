'use client'

import { ReactNode } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { sendGAEvent } from '@next/third-parties/google'

import styled from '@emotion/styled'
import useEmblaCarousel from 'embla-carousel-react'

import { PersonalChallengeType } from '@/entities/challenge/api'

import { LeafReward, LucideIcon } from '@/shared/components'
import { URL } from '@/shared/constants'
import { responsiveHorizontalPadding } from '@/shared/styles'

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
    <Section className={className}>
      <SectionHeader>
        <SectionTitle>오늘의 챌린지</SectionTitle>
        <SubDescription>혼자서도 충분해요. 오늘 하루 도전해보세요!</SubDescription>
      </SectionHeader>

      <CarouselWrapper>
        <EmblaContainer ref={emblaRef}>
          <EmblaSlideContainer>
            {personalChallenges.map((ch, index) => (
              <EmblaSlide key={ch.id} index={index}>
                <DailyCard>
                  <DailyImageArea>
                    <DailyImage
                      src={ch.thumbnailUrl}
                      alt={ch.description}
                      fill
                      sizes='(max-width: 768px) 100vw, 95vw'
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </DailyImageArea>
                  <DailyCardDescriptions>
                    <CardTitle>{ch.title}</CardTitle>
                    <CardDescription>{ch.description}</CardDescription>
                    <JoinButton onClick={() => handleClickCard(ch)}>자세히 보기</JoinButton>
                  </DailyCardDescriptions>
                </DailyCard>

                <StyledLeafReward reward={ch.leafReward} />
              </EmblaSlide>
            ))}
          </EmblaSlideContainer>
        </EmblaContainer>

        <LeftIconWrapper onClick={() => emblaApi?.scrollPrev()}>
          <ScrollIcon name='ChevronLeft' size={24} />
        </LeftIconWrapper>

        <RightIconWrapper onClick={() => emblaApi?.scrollNext()}>
          <ScrollIcon name='ChevronRight' size={24} />
        </RightIconWrapper>
      </CarouselWrapper>
    </Section>
  )
}
const Section = styled.section`
  display: flex;
  flex-direction: column;
`

const SectionHeader = styled.div`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;
  gap: 6px;
`

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const SubDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

const CarouselWrapper = styled.div`
  position: relative;
  margin-top: 12px;
  width: 100%;
  overflow: hidden;
`

const EmblaContainer = styled.div`
  width: 100%;
  overflow: hidden;
`

const EmblaSlideContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
`

const EmblaSlide = styled.div<{ index?: number }>`
  position: relative;
  flex: 0 0 100%;
  padding: 0 20px;
  box-sizing: border-box;

  ${({ index }) =>
    index === 0 &&
    `
    transform: none !important;
    opacity: 1 !important;
    visibility: visible !important;
  `}
`

const DailyCard = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
`

const DailyImageArea = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  border-top-left-radius: ${({ theme }) => theme.radius.base};
  border-top-right-radius: ${({ theme }) => theme.radius.base};
`

const DailyImage = styled(Image)`
  object-fit: cover;
`

const DailyCardDescriptions = styled.div`
  padding: 0 16px;
  margin-top: 12px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

const JoinButton = styled.button`
  width: 100%;
  margin: 12px 0;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
`

const ArrowButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ direction }) => (direction === 'prev' ? 'left: 8px;' : 'right: 8px;')}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  font-size: 18px;
  cursor: pointer;
  z-index: 10;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

const IconWrapper = styled.div`
  width: 40px;
  aspect-ratio: 1/1;
  padding: 10;
  position: absolute;
  top: 50%;

  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};

  cursor: pointer;
`

const LeftIconWrapper = styled(IconWrapper)`
  left: 0;
  transform: translateY(-50%);
`

const RightIconWrapper = styled(IconWrapper)`
  right: 0;
  transform: translateY(-50%);
`

const ScrollIcon = styled(LucideIcon)`
  width: 100%;
  height: 100%;
`

const StyledLeafReward = styled(LeafReward)`
  top: 4%;
  right: 9%;
`
