import { ChallengeCategoryType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { InfiniteScrollResponse } from '@shared/types/api'
import { ISOFormatString } from '@shared/types/date'

export interface GroupChallengeParticipateListParams {
  challengeId: number
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type Verification = {
  id: number
  nickname: string
  profileImageUrl: string
  verificationImageUrl: string
  description: string
  category: ChallengeCategoryType
  counts: {
    view: number
    like: number
    comment: number
  }
  createdAt: ISOFormatString
  isLiked: boolean
}

export type GroupChallengeParticipateList = InfiniteScrollResponse<{
  verifications: Verification[]
}>

export type GetGroupChallengeParticipateListResponse = GroupChallengeParticipateList

export const getGroupChallengeParticipateList = ({
  challengeId,
  cursorId,
  cursorTimestamp,
}: GroupChallengeParticipateListParams) => {
  return fetchRequest<GetGroupChallengeParticipateListResponse>(
    ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.LIST(challengeId),
    {
      query: {
        ...(cursorId !== undefined ? { cursorId } : {}),
        ...(cursorTimestamp ? { cursorTimestamp } : {}),
      },
    },
  )
}
