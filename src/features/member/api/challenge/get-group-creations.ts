import { ChallengeCategoryType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/types/api'
import { ISOFormatString } from '@shared/types/date'

interface MemberGroupChallengeCreationsParams {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type GroupChallengeResponse = {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
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
