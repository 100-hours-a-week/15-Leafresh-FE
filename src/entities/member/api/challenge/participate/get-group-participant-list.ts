import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { InfiniteScrollResponse } from '@shared/type/api'

export type ChallengeStatus = 'not_started' | 'ongoing' | 'completed'

export interface FetchGroupParticipationsParams {
  status: ChallengeStatus
  cursorId?: number
  cursorTimestamp?: string
}
export interface ParticipantChallengeItem {
  id: number
  title: string
  thumbnailUrl: string
  startDate: string
  endDate: string
  achievement: {
    success: number
    total: number
  }
}

export type ParticipantChallengeResponse = InfiniteScrollResponse<{
  data: {
    challenges: ParticipantChallengeItem[]
    hasNext: boolean
    cursorInfo: FetchGroupParticipationsParams
  }
  message: string
  status: number
}>

// 내가 "참여(participate)"한 챌린지
export const fetchGroupParticipations = ({ status, cursorId, cursorTimestamp }: FetchGroupParticipationsParams) => {
  return fetchRequest<ParticipantChallengeResponse>(ENDPOINTS.MEMBERS.CHALLENGE.GROUP.PARTICIPATIONS, {
    query: {
      status,
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
