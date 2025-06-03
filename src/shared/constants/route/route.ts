import { ChallengeCategoryType } from '@entities/challenge/type'

/**
 * FE라우트 엔드포인트 입니다
 */
// 레이아웃 체크 ✅
const MAIN_URL = {
  INDEX: {
    name: '메인',
    value: '/',
    isProtected: false,
  },
}

const MEMBER_URL = {
  // 레이아웃 체크 ✅
  LOGIN: {
    name: '로그인',
    value: '/member/login',
    isProtected: false,
  },
  // 레이아웃 체크 ✅
  SIGNUP: {
    name: '회원가입',
    value: '/member/signup',
    isProtected: false,
  },
  // 레이아웃 체크 ✅
  PROFILE: {
    MYPAGE: {
      name: '마이페이지',
      value: '/member/profile/mypage',
      isProtected: true,
    },
    // 레이아웃 체크 ✅
    MODIFY: {
      name: '프로필 수정',
      value: '/member/profile/modify',
      isProtected: true,
    },
  },
  // 레이아웃 체크 ✅
  ALARM: {
    name: '알림 확인',
    value: '/member/alarm',
    isProtected: true,
  },
  // 레이아웃 체크 ✅
  CHALLENGES: {
    CREATED: {
      name: '생성한 챌린지',
      value: '/member/challenges',
      isProtected: true,
    },
  },
  STORE: {
    // 레이아웃 체크 ✅
    PURCHASED: {
      name: '나뭇잎 상점 구매 목록',
      value: '/member/store/list',
      isProtected: true,
    },
  },
}

const CHALLENGE_URL = {
  PERSONAL: {
    // 레이아웃 체크 ✅
    DETAILS: {
      name: '개인 챌린지 상세',
      value: (personalId: number) => `/challenge/personal/${personalId}`,
      isProtected: false,
    },
  },
  GROUP: {
    // 레이아웃 체크 ✅
    LIST: {
      name: '단체 챌린지 목록',
      value: (category?: ChallengeCategoryType) =>
        category ? `/challenge/group/list?category=${category}` : '/challenge/group/list',
      isProtected: false,
    },
    // 레이아웃 체크 ✅
    CREATE: {
      name: '단체 챌린지 생성',
      value: (category?: ChallengeCategoryType) =>
        category ? `/challenge/group/create?category=${category}` : `/challenge/group/create`,
      isProtected: true,
    },
    // 레이아웃 체크 ✅
    MODIFY: {
      name: '단체 챌린지 수정',
      value: (challengeId: number) => `/challenge/group/${challengeId}/modify`,
    },
    // 레이아웃 체크 ✅
    DETAILS: {
      name: '단체 챌린지 상세',
      value: (challengeId: number) => `/challenge/group/${challengeId}`,
      isProtected: false,
    },
    // 레이아웃 체크 ✅
    PARTICIPATE_LIST: {
      name: '이용자 인증 내역 목록',
      value: (challengeId: number) => `/challenge/group/${challengeId}/participate/list`,
      isProtected: false,
    },
  },
  PARTICIPATE: {
    // 레이아웃 체크 ✅
    INDEX: {
      name: '참여중인 챌린지',
      value: `/challenge/participate`,
      isProtected: true,
    },
    // 레이아웃 체크 ✅
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
