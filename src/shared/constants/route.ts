import { ChallengeCategoryType } from '@/entities/challenge/model'

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
      value: (personalId: number) => `/challenge/personal/${personalId}`,
      dynamicPath: '/challenge/personal/[id]', // 👈 추가
      isProtected: false,
      hasBackButton: true,
    },
  },
  GROUP: {
    // TODO: 단체 챌린지 목록 페이지 제거하기
    LIST: {
      name: '단체 챌린지 목록',
      value: (category?: ChallengeCategoryType) =>
        category ? `/challenge/group/list?category=${category}` : '/challenge/group/list',
      dynamicPath: '/challenge/group/list',
      isProtected: false,
      hasBackButton: true,
    },
    CREATE: {
      name: '단체 챌린지 생성',
      value: (category?: ChallengeCategoryType) =>
        category ? `/challenge/group/create?category=${category}` : `/challenge/group/create`,
      dynamicPath: '/challenge/group/create',
      isProtected: true,
      hasBackButton: true,
    },
    MODIFY: {
      name: '단체 챌린지 수정',
      value: (challengeId: number) => `/challenge/group/${challengeId}/modify`,
      dynamicPath: '/challenge/group/[challengeId]/modify',
      isProtected: true,
      hasBackButton: true,
    },
    DETAILS: {
      name: '단체 챌린지 상세',
      value: (challengeId: number) => `/challenge/group/${challengeId}`,
      dynamicPath: '/challenge/group/[challengeId]',
      isProtected: false,
      hasBackButton: true,
    },
    VERIFICATION: {
      LIST: {
        name: '이용자 인증 내역 목록',
        value: (challengeId: number) => `/challenge/group/${challengeId}/verification/list`,
        dynamicPath: '/challenge/group/[challengeId]/verification/list',
        isProtected: false,
        hasBackButton: true,
      },
      DETAILS: {
        name: '챌린지 인증 상세',
        value: (challengeId: number, verificationId: number) =>
          `/challenge/group/${challengeId}/verification/${verificationId}`,
        dynamicPath: '/challenge/group/[challengeId]/verification/[verificationId]',
        isProtected: false,
        hasBackButton: true,
      },
    },
    FEED: {
      name: '챌린지 인증 피드',
      value: `/challenge/group/feed`,
      isProtected: false,
      hasBackButton: false,
    },
  },
}

const MAIN_URL = {
  INDEX: {
    name: '메인',
    value: '/',
    isProtected: false,
    hasBackButton: false,
  } as URL,
}

const MEMBER_URL = {
  LOGIN: {
    name: '로그인',
    value: '/member/login',
    isProtected: false,
    hasBackButton: true,
  },
  CALLBACK: {
    name: '소셜 로그인 콜백',
    value: (provider: string) => `/member/${provider}/callback`,
    dynamicPath: '/member/[provider]/callback',
    isProtected: false,
    hasBackButton: false,
  },
  SIGNUP: {
    name: '회원가입',
    value: '/member/signup',
    isProtected: false,
    hasBackButton: true,
  },
  PROFILE: {
    MYPAGE: {
      name: '마이페이지',
      value: '/member/profile/mypage',
      isProtected: true,
      hasBackButton: false,
    },

    MODIFY: {
      name: '프로필 수정',
      value: '/member/profile/modify',
      isProtected: true,
      hasBackButton: true,
    },
    BADGE: {
      name: '뱃지 조회',
      value: '/member/profile/badge',
      isProtected: true,
      hasBackButton: true,
    },
  },
  ALARM: {
    name: '알림 확인',
    value: '/member/alarm',
    isProtected: true,
    hasBackButton: true,
  },
  CHALLENGE: {
    PARTICIPATE: {
      // 참여 중인 챌린지
      LIST: {
        name: '참여중인 챌린지',
        value: `/member/challenge/participate/list`,
        isProtected: true,
      },
    },
    VERIFICATION: {
      // 특정 챌린지 인증 현황
      STATUS: {
        name: '특정 챌린지 인증 현황',
        value: (challengeId: number) => `/member/challenge/${challengeId}/verification/status`,
        isProtected: true,
      },
    },

    CREATE: {
      // 생성한 챌린지
      LIST: {
        name: '생성한 챌린지',
        value: '/member/challenge/create/list',
        isProtected: true,
        hasBackButton: true,
      },
    },
  },
  STORE: {
    PURCHASED: {
      name: '나뭇잎 상점 구매 목록',
      value: '/member/store/list',
      isProtected: true,
      hasBackButton: true,
    },
  },
}

const STORE_URL = {
  INDEX: {
    name: '나뭇잎 상점',
    value: `/store`,
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
