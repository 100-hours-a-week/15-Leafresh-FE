import { ChallengeVerificationResultType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { DateFormatString, TimeFormatString } from '@shared/types/date'

type ExampleImageType = {
  id: number
  imageUrl: string
  description: string
  sequenceNumber: number
  type: ChallengeVerificationResultType
}

export type GroupChallengeRulesListResponse = ApiResponse<{
  certificationPeriod: {
    startDate: DateFormatString
    endDate: DateFormatString
    startTime: TimeFormatString
    endTime: TimeFormatString
  }
  exampleImages: ExampleImageType[]
}>

export const getGroupChallengeRulesList = (challengeId: number): Promise<GroupChallengeRulesListResponse> => {
  return fetchRequest<GroupChallengeRulesListResponse>(ENDPOINTS.CHALLENGE.GROUP.RULES(challengeId))
}
