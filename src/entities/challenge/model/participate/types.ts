import { CHALLENGE_PARTICIPATION_STATUS } from './consts'

/** 인증 시도 여부 */
export type ChallengeParticipationType = (typeof CHALLENGE_PARTICIPATION_STATUS)[number]
