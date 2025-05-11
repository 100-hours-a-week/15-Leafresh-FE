// @features/challenge/api/getGroupChallengeDetails.ts

import { ChallengeVerificationResultType, ChallengeVerificationStatusType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { DateFormatString, TimeFormatString } from '@shared/types/date'

export type GroupChallengeDetail = {
  id: number
  isEvent: boolean // 이벤트 챌린지 여부
  title: string
  description: string
  startDate: DateFormatString
  endDate: DateFormatString
  verificationStartTime: TimeFormatString
  verificationEndTime: TimeFormatString
  leafReward: number
  thumbnailUrl: string
  exampleImages: {
    id: number
    imageUrl: string
    type: ChallengeVerificationResultType
    description: string
    sequenceNumber: number
  }[]
  verificationImages: string[]
  maxParticipantCount: number
  currentParticipantCount: number
  status: ChallengeVerificationStatusType
}

type GetGroupChallengeDetailResponse = ApiResponse<GroupChallengeDetail>

export const getGroupChallengeDetails = (id: number): Promise<GetGroupChallengeDetailResponse> => {
  return fetchRequest<GetGroupChallengeDetailResponse>(ENDPOINTS.CHALLENGE.GROUP.DETAILS(id))
}
