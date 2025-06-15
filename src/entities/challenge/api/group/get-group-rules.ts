import { ChallengeVerificationResultType } from '@entities/challenge/model'
import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { DateFormatString, TimeFormatString } from '@shared/types/date'

type ExampleImage = {
  id: number
  imageUrl: string
  description: string
  sequenceNumber: number
  type: ChallengeVerificationResultType
}

export type GroupChallengeRulesListResponse = {
  certificationPeriod: {
    startDate: DateFormatString
    endDate: DateFormatString
    startTime: TimeFormatString
    endTime: TimeFormatString
  }
  exampleImages: ExampleImage[]
}

export const getGroupChallengeRulesList = (challengeId: number) => {
  return fetchRequest<GroupChallengeRulesListResponse>(ENDPOINTS.CHALLENGE.GROUP.RULES(challengeId))
}
