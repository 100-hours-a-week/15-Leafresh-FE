import { ChallengeStatus } from '@features/challenge/api/participate/group-participant'

export const statusMap: Record<number, ChallengeStatus> = {
  0: 'not_started',
  1: 'ongoing',
  2: 'completed',
}
