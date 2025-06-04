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
    // 목록
    LIST: {
      staleTime: getHour(24),
      gcTime: getHour(24),
    },
    // 규약 조회
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
    // 인증 내역 목록 조회
    VERIFICATIONS: DEFAULT,
    // 규약 조회
    RULES: DEFAULT,
    // 인증 결과 조회 (롱폴링)
    VERIFICATION_RESULT: DEFAULT,
  },
}

const MEMBER_QUERY_DEFAULTS = {
  AUTH: {
    LOGIN: NO_CACHE,
    CALLBACK: NO_CACHE,
  },
  DUPLICATE_NICKNAME: NO_CACHE,
  DETAILS: DEFAULT,

  // 회원 정보
  PROFILE_CARD: DEFAULT,
  BADGES: DEFAULT,
  LEAVES: DEFAULT,
  FEEDBACK: DEFAULT,

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
}

export const QUERY_OPTIONS = {
  CHALLENGE: CHALLENGE_QUERY_DEFAULTS,
  MEMBER: MEMBER_QUERY_DEFAULTS,
  STORE: STORE_QUERY_DEFAULTS,
} as const
