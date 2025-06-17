import { FeedVerificationStatusType } from '@entities/challenge/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'
import { InfiniteScrollResponse } from '@shared/types/api'

export type ChallengeStatus = 'not_started' | 'ongoing' | 'completed'

export type FetchGroupParticipationsParams = {
  status: ChallengeStatus
  cursorId?: number
  cursorTimestamp?: string
}

export interface AchievementRecord {
  day: number
  status: FeedVerificationStatusType
}

export type ParticipantChallengeItem = {
  id: number
  title: string
  thumbnailUrl: string
  startDate: string
  endDate: string
  achievement: {
    success: number
    total: number
  }
  achievementRecords: AchievementRecord[]
}

export type ParticipantChallengeResponse = InfiniteScrollResponse<{
  challenges: ParticipantChallengeItem[]
  hasNext: boolean
  cursorInfo: FetchGroupParticipationsParams
}>

export const getGroupParticipations = ({ status, cursorId, cursorTimestamp }: FetchGroupParticipationsParams) => {
  return fetchRequest<ParticipantChallengeResponse>(ENDPOINTS.MEMBERS.CHALLENGE.GROUP.PARTICIPATIONS, {
    query: {
      status,
      ...(cursorId !== undefined ? { cursorId } : {}),
      ...(cursorTimestamp ? { cursorTimestamp } : {}),
    },
  })
}
