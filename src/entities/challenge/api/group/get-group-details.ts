import { ChallengeCategoryType, ChallengeVerificationResultType, ChallengeVerificationStatusType } from '../../model'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { ISOFormatString, TimeFormatString } from '@/shared/type'

export type GroupChallengeDetail = {
  id: number
  isEvent: boolean // 이벤트 챌린지 여부
  category: ChallengeCategoryType
  title: string
  description: string
  startDate: ISOFormatString
  endDate: ISOFormatString
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

type GetGroupChallengeDetailResponse = GroupChallengeDetail

export const getGroupChallengeDetails = (id: number) => {
  return fetchRequest<GetGroupChallengeDetailResponse>(ENDPOINTS.CHALLENGE.GROUP.DETAILS(id))
}
