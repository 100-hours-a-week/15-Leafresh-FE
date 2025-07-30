import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { ISOFormatString, TimeFormatString } from '@/shared/type'

import { ChallengeCategoryType, ChallengeVerificationResultType, ChallengeVerificationStatusType } from '../../model'

/**
  NOT_PARTICIPATED,   // 챌린지에 참여하지 않음 (미참여)
  NOT_SUBMITTED,      // 오늘 인증 미제출 (참여중)
  PENDING_APPROVAL,   // 오늘 인증 제출, 검토 대기 (참여중)
  SUCCESS,            // 오늘 인증 성공 (참여중)
  FAILURE             // 오늘 인증 실패 (참여중)
*/
export type GroupChallengeStatus = ChallengeVerificationStatusType | 'NOT_PARTICIPATED'

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
  status: GroupChallengeStatus
}

type GetGroupChallengeDetailResponse = GroupChallengeDetail

export const getGroupChallengeDetails = (id: number) => {
  return fetchRequest<GetGroupChallengeDetailResponse>(ENDPOINTS.CHALLENGE.GROUP.DETAILS(id))
}
