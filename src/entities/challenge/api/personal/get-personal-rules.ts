import { ChallengeVerificationResultType } from '@entities/challenge/model'
import { DayType } from '@entities/common'
import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { TimeFormatString } from '@shared/type/date'

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
