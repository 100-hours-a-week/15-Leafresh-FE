import { ChallengeCategoryType } from '@entities/common/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { InfiniteScrollResponse } from '@shared/types/api'
import { DateFormatString, ISOFormatString } from '@shared/types/date'

interface MemberGroupChallengeCreationsParams {
  cursorId?: number
  cursorTimestamp?: ISOFormatString
}

export type GroupChallengeResponse = {
  id: number
  name: string
  description: string
  startDate: DateFormatString // YYYY-mm-dd
  endDate: DateFormatString
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
