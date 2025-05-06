import {
  CHALLENGE_CATEGORIES,
  CHALLENGE_PARTICIPATION_STATUS,
  CHALLENGE_VERIFICATION_RESULT,
  CHALLENGE_VERIFICATION_STATUS,
  DAYS,
} from './constant'

/** 인증 시도 여부 */
export type ChallengeParticipationType = (typeof CHALLENGE_PARTICIPATION_STATUS)[number]

/** 인증 성공 여부 */
export type ChallengeVerificationResultType = (typeof CHALLENGE_VERIFICATION_RESULT)[number]

/** 인증 상태 */
export type ChallengeVerificationStatusType = (typeof CHALLENGE_VERIFICATION_STATUS)[number]

/** 요일 */
export type DayType = (typeof DAYS)[number]

/** 카테고리 */
export type ChallengeCategoryType = (typeof CHALLENGE_CATEGORIES)[number]
