// @features/challenge/api/getGroupChallengeDetails.ts

import {
  ChallengeCategoryType,
  ChallengeVerificationResultType,
  ChallengeVerificationStatusType,
} from '@entities/challenge/model'
import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { DateFormatString, TimeFormatString } from '@shared/types/date'

export type GroupChallengeDetail = {
  id: number
  isEvent: boolean // 이벤트 챌린지 여부
  category: ChallengeCategoryType
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

type GetGroupChallengeDetailResponse = GroupChallengeDetail

export const getGroupChallengeDetails = (id: number) => {
  return fetchRequest<GetGroupChallengeDetailResponse>(ENDPOINTS.CHALLENGE.GROUP.DETAILS(id))
}
