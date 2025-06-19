import { ChallengeVerificationResultType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { ISOFormatString, TimeFormatString } from '@shared/type/date'

type ExampleImage = {
  id: number
  imageUrl: string
  description: string
  sequenceNumber: number
  type: ChallengeVerificationResultType
}

export type GroupChallengeRulesListResponse = {
  certificationPeriod: {
    startDate: ISOFormatString
    endDate: ISOFormatString
    startTime: TimeFormatString
    endTime: TimeFormatString
  }
  exampleImages: ExampleImage[]
}

export const getGroupChallengeRulesList = (challengeId: number) => {
  return fetchRequest<GroupChallengeRulesListResponse>(ENDPOINTS.CHALLENGE.GROUP.RULES(challengeId))
}
