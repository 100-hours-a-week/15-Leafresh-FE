import { ChallengeVerificationResultType } from '../../model'

import { DayType, ENDPOINTS, fetchRequest } from '@/shared/lib'
import { TimeFormatString } from '@/shared/type'

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
