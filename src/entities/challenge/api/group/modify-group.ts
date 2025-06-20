import { ChallengeCategoryType, ChallengeVerificationResultType } from '../../model'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { ISOFormatString, TimeFormatString } from '@/shared/type'

export type KeepImage = {
  id: number
  sequenceNumber: number
}
export type NewImage = {
  imageUrl: string
  type: ChallengeVerificationResultType
  description: string
  sequenceNumber: number
}

export type ModifyChallengeBody = {
  title: string
  description: string
  category: ChallengeCategoryType // enum 값으로 관리
  maxParticipantCount: number
  thumbnailImageUrl: string
  startDate: ISOFormatString
  endDate: ISOFormatString
  verificationStartTime: TimeFormatString
  verificationEndTime: TimeFormatString
  exampleImages: {
    keep: KeepImage[]
    new: NewImage[]
    deleted: number[]
  }
}

export type ModifyChallengeVariables = {
  challengeId: number
  body: ModifyChallengeBody
}

/**
 * 단체 챌린지 수정 API
 */
export const ModifyChallenge = ({ challengeId, body }: ModifyChallengeVariables) => {
  return fetchRequest<null>(ENDPOINTS.CHALLENGE.GROUP.MODIFY(challengeId), {
    body,
  })
}
