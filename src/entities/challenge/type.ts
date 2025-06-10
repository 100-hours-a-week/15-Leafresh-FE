import {
  CHALLENGE_CATEGORY_PAIRS,
  CHALLENGE_PARTICIPATION_STATUS,
  CHALLENGE_VERIFICATION_RESULT,
  CHALLENGE_VERIFICATION_STATUS,
  DAY_PAIRS,
  FEED_VERIFICATION_STAUS,
} from './constant'

export type ConstantPair = { kor: string; eng: string }

/** 챌린지 종류 */
export type ChallengeType = 'GROUP' | 'PERSONAL'

/** 인증 시도 여부 */
export type ChallengeParticipationType = (typeof CHALLENGE_PARTICIPATION_STATUS)[number]

/** 인증 성공 여부 */
export type ChallengeVerificationResultType = (typeof CHALLENGE_VERIFICATION_RESULT)[number]

/** 인증 상태 */
export type ChallengeVerificationStatusType = (typeof CHALLENGE_VERIFICATION_STATUS)[number]

/** 피드 인증 상태 */
export type FeedVerificationStatusType = (typeof FEED_VERIFICATION_STAUS)[number]

/** 요일 */
export type DayType = (typeof DAY_PAIRS)[number]['eng']
export type DayTypeKor = (typeof DAY_PAIRS)[number]['kor']

/** 카테고리 */
export type ChallengeCategoryType = (typeof CHALLENGE_CATEGORY_PAIRS)[number]['eng']
export type ChallengeCategoryTypeKor = (typeof CHALLENGE_CATEGORY_PAIRS)[number]['kor']
