import { ChallengeCategoryType } from '@/entities/challenge/model'
import { ChallengeStatus } from '@/entities/member/api'

import { buildURI } from '../lib'

type URL = {
  name: string
  value: string
  isProtected: false
  hasBackButton: false
}

/**
 * FE 라우트
 */
const CHALLENGE_URL = {
  PERSONAL: {
    DETAILS: {
      name: '개인 챌린지 상세',
      value: (personalId: number) => buildURI(`/challenge/personal/${personalId}`),
    },
  },
  GROUP: {
    LIST: {
      name: '단체 챌린지 목록',
      value: (category?: ChallengeCategoryType) => buildURI('/challenge/group/list', { query: { category } }),
    },
    CREATE: {
      name: '단체 챌린지 생성',
      value: (category?: ChallengeCategoryType) => buildURI('/challenge/group/create', { query: { category } }),
    },
    MODIFY: {
      name: '단체 챌린지 수정',
      value: (challengeId: number) => buildURI(`/challenge/group/${challengeId}/modify`),
    },
    DETAILS: {
      name: '단체 챌린지 상세',
      value: (challengeId: number) => buildURI(`/challenge/group/${challengeId}`),
    },
    VERIFICATION: {
      LIST: {
        name: '이용자 인증 내역 목록',
        value: (challengeId: number) => buildURI(`/challenge/group/${challengeId}/verification/list`),
      },
      DETAILS: {
        name: '챌린지 인증 상세',
        value: (challengeId: number, verificationId: number) =>
          buildURI(`/challenge/group/${challengeId}/verification/${verificationId}`),
      },
    },
    FEED: {
      name: '챌린지 인증 피드',
      value: buildURI(`/challenge/group/feed`),
    },
  },
}

const MAIN_URL = {
  INDEX: {
    name: '메인',
    value: buildURI('/'),
  } as URL,
}

const MEMBER_URL = {
  LOGIN: {
    name: '로그인',
    value: (authorized?: boolean, expired?: boolean) => buildURI('/member/login', { query: { authorized, expired } }),
  },
  CALLBACK: {
    name: '소셜 로그인 콜백',
    value: (provider: string) => buildURI(`/member/${provider}/callback`),
  },
  SIGNUP: {
    name: '회원가입',
    value: buildURI('/member/signup'),
  },
  PROFILE: {
    MYPAGE: {
      name: '마이페이지',
      value: buildURI('/member/profile/mypage'),
    },
    MODIFY: {
      name: '프로필 수정',
      value: buildURI('/member/profile/modify'),
    },
    BADGE: {
      name: '뱃지 조회',
      value: buildURI('/member/profile/badge'),
    },
  },
  ALARM: {
    name: '알림 확인',
    value: buildURI('/member/alarm'),
  },
  CHALLENGE: {
    PARTICIPATE: {
      LIST: {
        name: '참여중인 챌린지',
        value: (status?: ChallengeStatus) => buildURI('/member/challenge/participate/list', { query: { status } }),
      },
    },
    VERIFICATION: {
      STATUS: {
        name: '특정 챌린지 인증 현황',
        value: (challengeId: number) => buildURI(`/member/challenge/${challengeId}/verification/status`),
      },
    },
    CREATE: {
      LIST: {
        name: '생성한 챌린지',
        value: buildURI('/member/challenge/create/list'),
      },
    },
  },
  STORE: {
    PURCHASED: {
      name: '나뭇잎 상점 구매 목록',
      value: buildURI('/member/store/list'),
    },
  },
}

const STORE_URL = {
  INDEX: {
    name: '나뭇잎 상점',
    value: buildURI('/store'),
  },
}

export const URL = {
  MAIN: MAIN_URL,
  MEMBER: MEMBER_URL,
  CHALLENGE: CHALLENGE_URL,
  STORE: STORE_URL,
} as const

export const PROTECTED_ROUTES = [
  '/challenge/group/create',
  '/challenge/group/[challengeId]/modify',
  '/member/profile/mypage',
  '/member/profile/modify',
  '/member/profile/badge',
  '/member/alarm',
  '/member/challenge/participate/list',
  '/member/challenge/[challengeId]/verification/status',
  '/member/challenge/create/list',
  '/member/store/list',
]

export const BACK_BUTTON_ROUTES = [
  '/challenge/personal/[id]',
  '/challenge/group/list',
  '/challenge/group/create',
  '/challenge/group/[challengeId]/modify',
  '/challenge/group/[challengeId]',
  '/challenge/group/[challengeId]/verification/list',
  '/challenge/group/[challengeId]/verification/[verificationId]',
  '/member/login',
  '/member/signup',
  '/member/profile/modify',
  '/member/profile/badge',
  '/member/alarm',
  '/member/challenge/[challengeId]/verification/status',
  '/member/challenge/create/list',
  '/member/store/list',
]

/**
 * 동적 경로를 정규표현식으로 변환
 * 예: /challenge/group/[challengeId] → ^/challenge/group/[^/]+$
 */
export const convertToRegexPattern = (path: string): RegExp => {
  const pattern = path.replace(/\[.*?Id\]/g, '\\d+').replace(/\[.*?\]/g, '[^/]+')
  return new RegExp(`^${pattern}$`)
}
