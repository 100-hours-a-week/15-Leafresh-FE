import { ChallengeCategoryType } from '@/entities/challenge/model'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { InfiniteScrollResponse, ISOFormatString } from '@/shared/type'

interface MemberGroupChallengeCreationsParams {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type GroupChallengeResponse = {
  id: number
  name: string
  description: string
  startDate: ISOFormatString
  endDate: ISOFormatString
  imageUrl: string
  currentParticipantCount: number
  category: ChallengeCategoryType
}

export type MemberGroupChallengeCreationsResponse = InfiniteScrollResponse<{
  groupChallenges: GroupChallengeResponse[]
}>

export const MemberGroupChallengeCreations = ({ cursorId, cursorTimestamp }: MemberGroupChallengeCreationsParams) => {
  const query = {
    ...(cursorId !== undefined ? { cursorId } : {}),
    ...(cursorTimestamp ? { cursorTimestamp } : {}),
  }
  return fetchRequest<MemberGroupChallengeCreationsResponse>(ENDPOINTS.MEMBERS.CHALLENGE.GROUP.CREATIONS, {
    query,
  })
}
