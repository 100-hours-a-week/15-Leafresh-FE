import { ChallengeStatus } from '@entities/member/api/challenge/participate/group-participant-list'

export const statusMap: Record<number, ChallengeStatus> = {
  0: 'not_started',
  1: 'ongoing',
  2: 'completed',
}
