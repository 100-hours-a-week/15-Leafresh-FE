import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { InfiniteScrollResponse } from '@shared/types/api'
import { ISOFormatString } from '@shared/types/date'

export interface GroupChallengeParticipateListParams {
  challengeId: number
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type VerificationType = {
  id: number
  nickname: string
  profileImageUrl: string
  verificationImageUrl: string
  description: string
}

export type GroupChallengeParticipateList = InfiniteScrollResponse<{
  items: VerificationType[]
}>

type GetGroupChallengeParticipateListResponse = GroupChallengeParticipateList

export const getGroupChallengeParticipateList = ({
  challengeId,
  cursorId,
  cursorTimestamp,
}: GroupChallengeParticipateListParams) => {
  return fetchRequest<GetGroupChallengeParticipateListResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATIONS(challengeId), {
    query: {
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
