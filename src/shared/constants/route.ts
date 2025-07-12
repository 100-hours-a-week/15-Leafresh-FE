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
      dynamicPath: '/challenge/personal/[id]',
      isProtected: false,
      hasBackButton: true,
    },
  },
  GROUP: {
    LIST: {
      name: '단체 챌린지 목록',
      value: (category?: ChallengeCategoryType) => buildURI('/challenge/group/list', { query: { category } }),
      dynamicPath: '/challenge/group/list',
      isProtected: false,
      hasBackButton: true,
    },
    CREATE: {
      name: '단체 챌린지 생성',
      value: (category?: ChallengeCategoryType) => buildURI('/challenge/group/create', { query: { category } }),
      dynamicPath: '/challenge/group/create',
      isProtected: true,
      hasBackButton: true,
    },
    MODIFY: {
      name: '단체 챌린지 수정',
      value: (challengeId: number) => buildURI(`/challenge/group/${challengeId}/modify`),
      dynamicPath: '/challenge/group/[challengeId]/modify',
      isProtected: true,
      hasBackButton: true,
    },
    DETAILS: {
      name: '단체 챌린지 상세',
      value: (challengeId: number) => buildURI(`/challenge/group/${challengeId}`),
      dynamicPath: '/challenge/group/[challengeId]',
      isProtected: false,
      hasBackButton: true,
    },
    VERIFICATION: {
      LIST: {
        name: '이용자 인증 내역 목록',
        value: (challengeId: number) => buildURI(`/challenge/group/${challengeId}/verification/list`),
        dynamicPath: '/challenge/group/[challengeId]/verification/list',
        isProtected: false,
        hasBackButton: true,
      },
      DETAILS: {
        name: '챌린지 인증 상세',
        value: (challengeId: number, verificationId: number) =>
          buildURI(`/challenge/group/${challengeId}/verification/${verificationId}`),
        dynamicPath: '/challenge/group/[challengeId]/verification/[verificationId]',
        isProtected: false,
        hasBackButton: true,
      },
    },
    FEED: {
      name: '챌린지 인증 피드',
      value: buildURI(`/challenge/group/feed`),
      isProtected: false,
      hasBackButton: false,
    },
  },
}

const MAIN_URL = {
  INDEX: {
    name: '메인',
    value: buildURI('/'),
    isProtected: false,
    hasBackButton: false,
  } as URL,
}

const MEMBER_URL = {
  LOGIN: {
    name: '로그인',
    value: buildURI('/member/login'),
    isProtected: false,
    hasBackButton: true,
  },
  CALLBACK: {
    name: '소셜 로그인 콜백',
    value: (provider: string) => buildURI(`/member/${provider}/callback`),
    dynamicPath: '/member/[provider]/callback',
    isProtected: false,
    hasBackButton: false,
  },
  SIGNUP: {
    name: '회원가입',
    value: buildURI('/member/signup'),
    isProtected: false,
    hasBackButton: true,
  },
  PROFILE: {
    MYPAGE: {
      name: '마이페이지',
      value: buildURI('/member/profile/mypage'),
      isProtected: true,
      hasBackButton: false,
    },
    MODIFY: {
      name: '프로필 수정',
      value: buildURI('/member/profile/modify'),
      isProtected: true,
      hasBackButton: true,
    },
    BADGE: {
      name: '뱃지 조회',
      value: buildURI('/member/profile/badge'),
      isProtected: true,
      hasBackButton: true,
    },
  },
  ALARM: {
    name: '알림 확인',
    value: buildURI('/member/alarm'),
    isProtected: true,
    hasBackButton: true,
  },
  CHALLENGE: {
    PARTICIPATE: {
      LIST: {
        name: '참여중인 챌린지',
        value: (status?: ChallengeStatus) => buildURI('/member/challenge/participate/list', { query: { status } }),
        isProtected: true,
        hasBackButton: false,
      },
    },
    VERIFICATION: {
      STATUS: {
        name: '특정 챌린지 인증 현황',
        value: (challengeId: number) => buildURI(`/member/challenge/${challengeId}/verification/status`),
        isProtected: true,
        hasBackButton: true,
      },
    },
    CREATE: {
      LIST: {
        name: '생성한 챌린지',
        value: buildURI('/member/challenge/create/list'),
        isProtected: true,
        hasBackButton: true,
      },
    },
  },
  STORE: {
    PURCHASED: {
      name: '나뭇잎 상점 구매 목록',
      value: buildURI('/member/store/list'),
      isProtected: true,
      hasBackButton: true,
    },
  },
}

const STORE_URL = {
  INDEX: {
    name: '나뭇잎 상점',
    value: buildURI('/store'),
    isProtected: false,
    hasBackButton: false,
  },
}

export const URL = {
  MAIN: MAIN_URL,
  MEMBER: MEMBER_URL,
  CHALLENGE: CHALLENGE_URL,
  STORE: STORE_URL,
} as const
