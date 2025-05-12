import { ChallengeVerificationResultType, DayType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { TimeFormatString } from '@shared/types/date'

type ExampleImageType = {
  id: number
  imageUrl: string
  description: string
  sequenceNumber: number
  type: ChallengeVerificationResultType
}

export type PersonalChallengeRulesListResponse = ApiResponse<{
  certificationPeriod: {
    dayOfWeek: DayType
    startTime: TimeFormatString
    endTime: TimeFormatString
  }
  exampleImages: ExampleImageType[]
}>

export const getPersonalChallengeRulesList = (challengeId: number): Promise<PersonalChallengeRulesListResponse> => {
  return fetchRequest<PersonalChallengeRulesListResponse>(ENDPOINTS.CHALLENGE.PERSONAL.RULES(challengeId))
}
