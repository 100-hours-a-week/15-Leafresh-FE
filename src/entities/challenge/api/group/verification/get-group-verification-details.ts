import { ENDPOINTS } from '@shared/constants/endpoint'
import { fetchRequest } from '@shared/lib/api'

/**
 * 단체 챌린지 참여자의 일별 인증 내역 조회
 * GET /api/members/challenges/group/participations/{challengeId}/verifications
 */
export type GetGroupVerificationsResponse = {
  id: number
  title: string
  achievement: {
    success: number
    failure: number
    remaining: number
  }
  verifications: Array<{
    day: number
    imageUrl: string
    status: 'SUCCESS' | 'FAILURE' | 'PENDING_APPROVAL'
  }>
  todayStatus: 'NOT_SUBMITTED' | 'PENDING_APPROVAL' | 'DONE'
}

export const getGroupVerifications = (challengeId: number) =>
  fetchRequest<GetGroupVerificationsResponse>(ENDPOINTS.MEMBERS.CHALLENGE.GROUP.VERIFICATIONS(challengeId))
