import { PersonalChallengeType } from '@entities/challenge/api'

export interface PersonalChallengeSectionProps {
  personalChallenges: PersonalChallengeType[]
  className?: string
}
