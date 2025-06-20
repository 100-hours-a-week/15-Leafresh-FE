import { FeedVerificationStatusType } from '@/entities/challenge/model'
import { ENDPOINTS, fetchRequest } from '@/shared/lib'
import { InfiniteScrollResponse, ISOFormatString } from '@/shared/type'

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
  startDate: ISOFormatString
  endDate: ISOFormatString
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
