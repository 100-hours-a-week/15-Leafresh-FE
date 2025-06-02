import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { PersonalChallengeType } from '@features/challenge/api/get-personal-challenge-list'
import { URL } from '@shared/constants/route/route'

interface PersonalChallengeSectionProps {
  personalChallenges: PersonalChallengeType[]
  className?: string
}

export const PersonalChallengeSection = ({
  personalChallenges,
  className,
}: PersonalChallengeSectionProps): ReactNode => {
  const router = useRouter()

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>일일 챌린지</SectionTitle>
        <SubDescription>혼자서도 충분해요. 오늘 하루 도전해보세요!</SubDescription>
      </SectionHeader>
      <DailyCardWrapper>
        {personalChallenges.map(ch => (
          <DailyCard key={ch.id}>
            <CardTop>
              <DailyImageArea>
                <DailyImage src={ch.thumbnailUrl} alt={ch.description} fill />
              </DailyImageArea>
            </CardTop>
            <DailyCardDescriptions>
              <CardTitle>{ch.title}</CardTitle>
              <CardDescription>{ch.description}</CardDescription>
              <JoinButton onClick={() => router.push(URL.CHALLENGE.PERSONAL.DETAILS.value(ch.id))}>
                자세히 보기
              </JoinButton>
            </DailyCardDescriptions>
          </DailyCard>
        ))}
      </DailyCardWrapper>
    </Section>
  )
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionTitle = styled.h2`
  position: relative;

  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const SubDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

const DailyCard = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};

  box-shadow: ${({ theme }) => theme.shadow.lfInput};
`

const CardTop = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;
`

const DailyImageArea = styled.div`
  width: 100%;
  aspect-ratio: 16/9;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  border-top-left-radius: ${({ theme }) => theme.radius.base};
  border-top-right-radius: ${({ theme }) => theme.radius.base};
  overflow: hidden;
`

const DailyImage = styled(Image)`
  object-fit: cover;
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
const DailyCardDescriptions = styled.div`
  padding: 0 16px;
  margin-top: 8px;
  margin-bottom: 8px;

  display: flex;
  flex-direction: column;
  gap: 14px;

  transition: all 0.3s ease; // optional: hover 부드럽게
`
const CardTitle = styled.h3`
  margin: 4px 0px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  white-space: pre-wrap;
`

const DailyCardWrapper = styled.div`
  width: 100%;
  margin-top: 20px;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`
