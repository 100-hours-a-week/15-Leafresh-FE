export interface URL {
  name: string // 구분값 (라우트 버튼 내 값으로도 사용 가능)
  value: string
}

/**
 * FE라우트 엔드포인트 입니다
 */
const MAIN_URL = {
  INDEX: {
    name: '메인',
    value: '/',
  },
}

const MEMBER_URL = {
  LOGIN: {
    name: '로그인',
    value: '/member/login',
  },
  PROFILE: {
    MYPAGE: {
      name: '마이페이지',
      value: '/member/profile/mypage',
    },
    MODIFY: {
      name: '프로필 수정',
      value: '/member/profile/modify',
    },
  },
  ALARM: {
    name: '알림 확인',
    value: '/member/alarm',
  },
  CHALLENGES: {
    CREATED: {
      name: '생성한 챌린지',
      value: '/member/challenges',
    },
  },
  STORE: {
    PURCHASED: {
      name: '나뭇잎 상점 구매 목록',
      value: '/member/store/list',
    },
  },
}

const CHALLENGE_URL = {
  INDEX: {
    name: '챌린지 목록',
    value: '/challenge',
  },
  PERSONAL: {
    DETAILS: {
      name: '개인 챌린지 상세',
      value: (personalId: number) => `/challenge/personal/${personalId}`,
    },
  },
  GROUP: {
    LIST: {
      name: '단체 챌린지 목록',
      value: '/challenge/group/list',
    },
    CREATE: {
      name: '단체 챌린지 생성',
      value: 'challenge/group/create',
    },
    MODIFY: {
      name: '단체 챌린지 수정',
      value: '/challenge/group/modify',
    },
    DETAILS: {
      name: '단체 챌린지 상세',
      value: (challengeId: number) => `/challenge/group/${challengeId}`,
    },
    PARTICIPATE_LIST: {
      name: '이용자 인증 내역 목록',
      value: (challengeId: number) => `/challenge/group/${challengeId}/participate/list`,
    },
  },
  PARTICIPATE: {
    INDEX: {
      name: '참여중인 챌린지',
      value: `/challenge/participate`,
    },
    DETAILS: {
      name: '챌린지 인증 현황',
      value: (participateId: number) => `/challenge/participate/${participateId}`,
    },
  },
}

const STORE_URL = {
  INDEX: {
    name: '나뭇잎 상점',
    value: `store`,
  },
}

export const URL = {
  MAIN: MAIN_URL,
  MEMBER: MEMBER_URL,
  CHALLENGE: CHALLENGE_URL,
  STORE: STORE_URL,
} as const
