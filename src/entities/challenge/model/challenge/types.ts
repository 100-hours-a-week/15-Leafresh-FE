import { CHALLENGE_CATEGORY_PAIRS } from './consts'

/** 챌린지 종류 */
export type ChallengeType = 'GROUP' | 'PERSONAL'

/** 카테고리 */
export type ChallengeCategoryType = (typeof CHALLENGE_CATEGORY_PAIRS)[number]['eng']
export type ChallengeCategoryTypeKor = (typeof CHALLENGE_CATEGORY_PAIRS)[number]['kor']
