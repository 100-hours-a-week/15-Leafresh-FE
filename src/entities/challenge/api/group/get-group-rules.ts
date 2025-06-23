import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { ISOFormatString, TimeFormatString } from '@/shared/type'

import { ChallengeVerificationResultType } from '../../model'

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
