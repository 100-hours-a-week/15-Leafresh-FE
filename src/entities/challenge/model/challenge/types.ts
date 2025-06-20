import { z } from 'zod'

import { CHALLENGE_CATEGORY_PAIRS, detailSchema, FEED_VERIFICATION_STAUS, fullSchema, metaSchema } from './consts'

/** 챌린지 종류 */
export type ChallengeType = 'GROUP' | 'PERSONAL'

/** 카테고리 */
export type ChallengeCategoryType = (typeof CHALLENGE_CATEGORY_PAIRS)[number]['eng']
export type ChallengeCategoryTypeKor = (typeof CHALLENGE_CATEGORY_PAIRS)[number]['kor']

// DB에 없는 필터용 카테고리
export type FilterChallengeCategoryType = ChallengeCategoryType | 'ALL'
export type FilterChallengeCategoryTypeKor = ChallengeCategoryType | '전체'

/** 피드 인증 상태 */
export type FeedVerificationStatusType = (typeof FEED_VERIFICATION_STAUS)[number]

/** 챌린지 스키마 타입 */
export type MetaFormValues = z.infer<typeof metaSchema>
export type DetailFormValues = z.infer<typeof detailSchema>
export type FullFormValues = z.infer<typeof fullSchema>
