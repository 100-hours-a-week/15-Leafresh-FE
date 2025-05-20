import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/types/\bapi'
import { ISOFormatString } from '@shared/types/date'

interface MemberGroupChallengeCreationsParams {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

type GroupChallengeResponse = {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  imageUrl: string
  currentParticipantCount: number
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
