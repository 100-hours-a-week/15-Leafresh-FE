const getMinute = (minute: number) => {
  return 1000 * 60 * minute
}

const getHour = (hour: number) => {
  return 1000 * 60 * 60 * hour
}

const NO_CACHE = {
  staleTime: 0,
  gcTime: 0,
}
const DEFAULT = {
  staleTime: 0,
  gcTime: getMinute(5),
}

const CHALLENGE_QUERY_DEFAULTS = {
  EVENT: {
    LIST: {
      staleTime: getHour(24),
      gcTime: getHour(24),
    },
  },
  /** 개인 챌린지 */
  PERSONAL: {
    // 상세 (단일 조회)
    DETAILS: {
      staleTime: getHour(24),
      gcTime: getHour(24),
    },
    // 규약 조회
    // 목록
    LIST: {
      staleTime: getHour(24),
      gcTime: getHour(24),
    },
    RULES: {
      staleTime: getHour(24),
      gcTime: getHour(24),
    },
    // 인증 결과 조회 (롱폴링)
    VERIFICATION_RESULT: DEFAULT,
  },

  /** 단체 챌린지 */
  GROUP: {
    // 카테고리 목록
    CATEGORIES: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
    // 상세
    DETAILS: DEFAULT,
    // 목록 (검색 포함)
    LIST: DEFAULT,

    // 규약 조회
    RULES: DEFAULT,

    VERIFICATION: {
      // 인증 내역 목록 조회
      LIST: DEFAULT,

      // 인증 결과 조회 (롱폴링)
      RESULT: DEFAULT,

      //인증 상세
      DETAILS: NO_CACHE,
      //인증 댓글
      COMMENT: DEFAULT,
    },

    // 인증 내역 목록 조회 (피드) - 무작위 챌린지
    FEED: NO_CACHE,
  },

  ETC: {
    // 누적 사용자 인증수 조회
    COUNT: {
      VERIFICATION: NO_CACHE,
    },
  },
}

const MEMBER_QUERY_DEFAULTS = {
  AUTH: {
    LOGIN: NO_CACHE,
    CALLBACK: NO_CACHE,
  },
  DUPLICATE_NICKNAME: NO_CACHE,

  // 회원 정보
  DETAILS: DEFAULT,
  PROFILE_CARD: DEFAULT,
  LEAVES: DEFAULT,
  FEEDBACK: {
    GET_FEEDBACK: {
      staleTime: getHour(24),
      gcTime: getHour(24),
    },
    RESULT: {
      staleTime: getHour(24),
      gcTime: getHour(24),
    },
  },

  //뱃지 리스트
  BADGES: {
    LIST: NO_CACHE,
    RECENT: NO_CACHE,
  },

  // 알림
  NOTIFICATION: {
    LIST: DEFAULT,
  },

  // 나뭇잎 상점
  STORE: {
    ORDERS: {
      LIST: DEFAULT,
    },
  },

  /** 챌린지 */
  CHALLENGE: {
    GROUP: {
      // 생성한 챌린지
      CREATIONS: DEFAULT,

      // 참여한 단체 챌린지 카운트
      COUNT: DEFAULT,

      // 내가 참여한 챌린지
      PARTICIPATIONS: DEFAULT,

      // 인증 내역을 일별로 확인
      VERIFICATIONS: DEFAULT,
    },
  },
}

const STORE_QUERY_DEFAULTS = {
  TIME_DEAL: {
    // 타임딜 상품 목록
    LIST: DEFAULT,
  },
  PRODUCTS: {
    // 일반 상품 목록
    LIST: DEFAULT,
  },
  ETC: {
    COUNT: {
      // 누적 나뭇잎 수 조회
      LEAVES: NO_CACHE,
    },
  },
}

export const QUERY_OPTIONS = {
  CHALLENGE: CHALLENGE_QUERY_DEFAULTS,
  MEMBER: MEMBER_QUERY_DEFAULTS,
  STORE: STORE_QUERY_DEFAULTS,
} as const
