import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type ChallengeStatus = 'not_started' | 'ongoing' | 'completed'

export interface FetchGroupParticipationsParams {
  status: ChallengeStatus
  cursorId?: number
  cursorTimestamp?: string
}

export interface ChallengeResponse {
  status: number
  message: string
  data: {
    challenges: Array<{
      id: number
      title: string
      thumbnailUrl: string
      startDate: string
      endDate: string
      achievement: {
        success: number
        total: number
      }
    }>
    hasNext: boolean
    cursorInfo: {
      lastCursorId: number
      cursorTimestamp: string
    }
  }
}

export const fetchGroupParticipations = ({
  status,
  cursorId,
  cursorTimestamp,
}: FetchGroupParticipationsParams): Promise<ChallengeResponse> => {
  return fetchRequest(ENDPOINTS.MEMBERS.CHALLENGE.GROUP.PARTICIPATIONS, {
    query: {
      status,
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
