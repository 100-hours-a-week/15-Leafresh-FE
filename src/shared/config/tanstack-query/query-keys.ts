import { ChallengeCategoryType, FilterChallengeCategoryType } from '@/entities/challenge/model'
import { ChallengeStatus } from '@/entities/member/api'
import { LowercaseOAuthType } from '@/entities/member/model'

import { DayType } from '@/shared/lib'

const CHALLENGE_QUERY_KEYS = {
  /** 이벤트 챌린지 */
  EVENT: {
    // 목록
    LIST: ['challenges', 'events'],
  },

  /** 개인 챌린지 */
  PERSONAL: {
    // 상세 (단일 조회)
    DETAILS: (challengeId: number) => ['challenges', 'personal', challengeId],
    // 목록
    LIST: (dayOfWeek: DayType) => ['challenges', 'personal', dayOfWeek],
    // 규약 조회
    RULES: (challengeId: number) => ['challenges', 'personal', challengeId, 'rules'],
    // 인증 결과 조회 (롱폴링)
    VERIFICATION: {
      RESULT: (challengeId: number) => ['challenges', 'personal', challengeId, 'verification', 'result'],
    },
  },

  /** 단체 챌린지 */
  GROUP: {
    // 카테고리 목록
    CATEGORIES: ['challenges', 'group', 'categories'],
    // 상세
    DETAILS: (challengeId: number) => ['challenges', 'group', challengeId],
    // 목록
    LIST: (category: FilterChallengeCategoryType, input: string | undefined) => [
      'challenges',
      'group',
      category,
      input ?? '',
    ],

    // 규약
    RULES: (challengeId: number) => ['challenges', 'group', challengeId, 'rules'],

    VERIFICATION: {
      // 인증 내역 목록 조회
      LIST: (challengeId: number) => ['challenges', 'group', challengeId, 'verification'],
      // 인증 결과 확인
      RESULT: (challengeId: number) => ['challenges', 'group', challengeId, 'verification', 'result'],

      DETAILS: (challengeId: number, verificationId: number) => [
        'challenges',
        'group',
        challengeId,
        'verification',
        verificationId,
      ],
      COMMENT: (challengeId: number, verificationId: number) => [
        'challenges',
        'group',
        challengeId,
        'verification',
        verificationId,
        'comments',
      ],
    },
    // 피드
    FEED: (category: ChallengeCategoryType | undefined) => ['challenges', 'group', 'verifications', category ?? ''],
  },

  ETC: {
    // 누적 사용자 인증수 조회
    COUNT: {
      VERIFICATION: ['challenge', 'verification', 'count'],
    },
  },
}

const MEMBER_QUERY_KEYS = {
  AUTH: {
    LOGIN: (provider: LowercaseOAuthType) => ['member', 'oauth', provider],
    CALLBACK: (provider: LowercaseOAuthType) => ['member', 'oauth', provider, 'callback'],
  },

  DUPLICATE_NICKNAME: ['member', 'nickname'], // 닉네임 중복 검사

  // 회원 정보
  DETAILS: ['member', 'profile'], // 내 정보 조회
  PROFILE_CARD: ['member', 'profileCard'], // 프로필 카드 조회
  LEAVES: ['member', 'leaves'], // 나뭇잎 개수 조회

  FEEDBACK: {
    GET_FEEDBACK: ['member', 'feedback'], // 챌린지 피드백 조회
    RESULT: ['member', 'feedback', 'result'],
  },

  BADGES: {
    LIST: ['member', 'badges', 'list'], // 뱃지 조회
    RECENT: (count: number) => ['member', 'badges', 'recent', count], //최근 획득 뱃지 조회
  },

  // 알림
  NOTIFICATION: {
    LIST: ['member', 'notifications'], // 알림 조회
  },

  // 나뭇잎 상점
  STORE: {
    ORDERS: {
      LIST: ['member', 'store', 'orders'], // 구매 내역
    },
  },

  /** 챌린지 */
  CHALLENGE: {
    GROUP: {
      CREATIONS: ['member', 'challenges', 'group', 'creations'], // 생성한 챌린지
      COUNT: ['member', 'challenges', 'group', 'participations', 'count'], // 참여한 단체 챌린지 카운트
      PARTICIPATIONS: (status: ChallengeStatus) => ['member', 'challenges', 'group', 'participations', status], // 내가 참여한 챌린지

      // 인증 내역을 일별로 확인
      VERIFICATIONS: (challengeId: number) => [
        'member',
        'challenges',
        'group',
        'participations',
        challengeId,
        'verifications',
      ],
    },
  },
}

const POST_QUERY_KEYS = {
  // 목록 조회
  LIST: (input: string, filter: string) => ['posts', input, filter],

  // 상세 조회
  DETAILS: (postId: number) => ['posts', postId],

  COMMENTS: {
    // 댓글 목록 조회
    LIST: (postId: number) => ['posts', postId, 'comments'],
  },

  /** 좋아요 */
  LIKES: {
    // 개수
    COUNT: (postId: number) => ['posts', postId, 'likes'],
  },
}
const STORE_QUERY_KEYS = {
  TIME_DEAL: {
    // 타임딜 상품 목록
    LIST: ['store', 'timedeals'],
  },
  PRODUCTS: {
    // 일반 상품 목록
    LIST: (input: string) => ['store', 'products', input],
  },
  ETC: {
    COUNT: {
      // 누적 나뭇잎 수 조회
      LEAVES: ['store', 'leaves', 'count'],
    },
  },
}
/**
 * GET
 * Constant Query Keys to use Query convenient
 */
export const QUERY_KEYS = {
  CHALLENGE: CHALLENGE_QUERY_KEYS,
  STORE: STORE_QUERY_KEYS,
  MEMBER: MEMBER_QUERY_KEYS,
  POST: POST_QUERY_KEYS,
}
