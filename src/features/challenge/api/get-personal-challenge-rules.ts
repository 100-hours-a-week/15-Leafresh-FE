import { ChallengeVerificationResultType, DayType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { TimeFormatString } from '@shared/types/date'

export type PersonalChallengeExampleImageType = {
  id: number
  imageUrl: string
  description: string
  sequenceNumber: number
  type: ChallengeVerificationResultType
}

export type PersonalChallengeRulesListResponse = {
  certificationPeriod: {
    dayOfWeek: DayType
    startTime: TimeFormatString
    endTime: TimeFormatString
  }
  exampleImages: PersonalChallengeExampleImageType[]
}

export const getPersonalChallengeRulesList = (challengeId: number) => {
  return fetchRequest<PersonalChallengeRulesListResponse>(ENDPOINTS.CHALLENGE.PERSONAL.RULES(challengeId))
}
