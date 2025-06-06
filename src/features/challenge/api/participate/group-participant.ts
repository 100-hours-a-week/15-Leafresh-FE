import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'
import { InfiniteScrollResponse } from '@shared/types/api'

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

export const fetchGroupParticipations = ({ status, cursorId, cursorTimestamp }: FetchGroupParticipationsParams) => {
  return fetchRequest<ParticipantChallengeResponse>(ENDPOINTS.MEMBERS.CHALLENGE.GROUP.PARTICIPATIONS, {
    query: {
      status,
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
