import { ChallengeCategoryType } from '@entities/challenge/type'

/**
 * FE라우트 엔드포인트 입니다
 */
// 레이아웃 체크 필요 ✅  TODO: 뱃지 목록 페이지, 마이페이지, 프로필 수정
const MAIN_URL = {
  INDEX: {
    name: '메인',
    value: '/',
    isProtected: false,
  },
}

const MEMBER_URL = {
  LOGIN: {
    name: '로그인',
    value: '/member/login',
    isProtected: false,
  },
  CALLBACK: {
    name: '소셜 로그인 콜백',
    value: (provider: string) => `/member/${provider}/callback`,
    isProtected: false,
  },
  SIGNUP: {
    name: '회원가입',
    value: '/member/signup',
    isProtected: false,
  },
  PROFILE: {
    MYPAGE: {
      name: '마이페이지',
      value: '/member/profile/mypage',
      isProtected: true,
    },
    MODIFY: {
      name: '프로필 수정',
      value: '/member/profile/modify',
      isProtected: true,
    },
    BADGE: {
      name: '뱃지 조회',
      value: '/member/profile/badge',
    },
  },
  ALARM: {
    name: '알림 확인',
    value: '/member/alarm',
    isProtected: true,
  },
  CHALLENGES: {
    CREATED: {
      name: '생성한 챌린지',
      value: '/member/challenges',
      isProtected: true,
    },
  },
  STORE: {
    PURCHASED: {
      name: '나뭇잎 상점 구매 목록',
      value: '/member/store/list',
      isProtected: true,
    },
  },
}

const CHALLENGE_URL = {
  PERSONAL: {
    DETAILS: {
      name: '개인 챌린지 상세',
      value: (personalId: number) => `/challenge/personal/${personalId}`,
      isProtected: false,
    },
  },
  GROUP: {
    LIST: {
      name: '단체 챌린지 목록',
      value: (category?: ChallengeCategoryType) =>
        category ? `/challenge/group/list?category=${category}` : '/challenge/group/list',
      isProtected: false,
    },
    CREATE: {
      name: '단체 챌린지 생성',
      value: (category?: ChallengeCategoryType) =>
        category ? `/challenge/group/create?category=${category}` : `/challenge/group/create`,
      isProtected: true,
    },
    MODIFY: {
      name: '단체 챌린지 수정',
      value: (challengeId: number) => `/challenge/group/${challengeId}/modify`,
    },
    DETAILS: {
      name: '단체 챌린지 상세',
      value: (challengeId: number) => `/challenge/group/${challengeId}`,
      isProtected: false,
    },
    PARTICIPATE_LIST: {
      name: '이용자 인증 내역 목록',
      value: (challengeId: number) => `/challenge/group/${challengeId}/participate/list`,
      isProtected: false,
    },
    FEED: {
      name: '챌린지 인증 피드',
      value: `/challenge/group/feed`,
      isProtected: false,
    },
  },
  PARTICIPATE: {
    INDEX: {
      name: '참여중인 챌린지',
      value: `/challenge/participate`,
      isProtected: true,
    },
    DETAILS: {
      name: '챌린지 인증 현황',
      value: (participateId: number) => `/challenge/participate/${participateId}`,
      isProtected: true,
    },
  },
}

const STORE_URL = {
  INDEX: {
    name: '나뭇잎 상점',
    value: `/store`,
    isProtected: false,
  },
}

export const URL = {
  MAIN: MAIN_URL,
  MEMBER: MEMBER_URL,
  CHALLENGE: CHALLENGE_URL,
  STORE: STORE_URL,
} as const
