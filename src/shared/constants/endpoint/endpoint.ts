import { LowercaseOAuthType } from '@entities/member/type'

import { HttpMethod } from '../http'

export type EndpointType = {
  method: HttpMethod
  path: string
}

const CHALLENGE_ENDPOINTS = {
  /** 이벤트 챌린지 */
  EVENT: {
    // 목록
    LIST: { method: HttpMethod.GET, path: '/api/challenges/events' },
  },

  /** 개인 챌린지 */
  PERSONAL: {
    // 상세 (단일 조회)
    DETAILS: (challengeId: number) => ({
      method: HttpMethod.GET,
      path: `/api/challenges/personal/${challengeId}`,
    }),

    // 목록 (특정 카테고리)
    LIST: {
      method: HttpMethod.GET,
      path: `/api/challenges/personal`,
    },

    // 인증 제출
    VERIFY: (challengeId: number) => ({
      method: HttpMethod.POST,
      path: `/api/challenges/personal/${challengeId}/verifications`,
    }),

    // 인증 결과 조회 (롱폴링)
    VERIFICATION_RESULT: (challengeId: number) => ({
      method: HttpMethod.GET,
      path: `/api/challenges/personal/${challengeId}/verification/result`,
    }),

    // 규약 조회
    RULES: (challengeId: number) => ({
      method: HttpMethod.GET,
      path: `/api/challenges/personal/${challengeId}/rules`,
    }),
  },

  /** 단체 챌린지 */
  GROUP: {
    // 카테고리 목록
    CATEGORIES: { method: HttpMethod.GET, path: '/api/challenges/group/categories' },

    // 상세
    // TODO: UTC 체크
    DETAILS: (challengeId: number) => ({
      method: HttpMethod.GET,
      path: `/api/challenges/group/${challengeId}`,
    }),
    //목록
    // TODO: UTC 체크
    LIST: { method: HttpMethod.GET, path: '/api/challenges/group' },
    // 생성
    // TODO: UTC 체크
    CREATE: { method: HttpMethod.POST, path: '/api/challenges/group' },
    // 수정
    // TODO: UTC 체크
    MODIFY: (challengeId: number) => ({
      method: HttpMethod.PATCH,
      path: `/api/challenges/group/${challengeId}`,
    }),

    // 삭제
    DELETE: (challengeId: number) => ({
      method: HttpMethod.DELETE,
      path: `/api/challenges/group/${challengeId}`,
    }),

    // 인증 규약 조회
    // TODO: UTC 체크
    RULES: (challengeId: number) => ({
      method: HttpMethod.GET,
      path: `/api/challenges/group/${challengeId}/rules`,
    }),

    // 참여 이력 생성
    PARTICIPATE: (challengeId: number) => ({
      method: HttpMethod.POST,
      path: `/api/challenges/group/${challengeId}/participations`,
    }),

    // 인증 관련
    VERIFICATION: {
      // 특정 단체 챌린지 인증 내역 목록 조회
      LIST: (challengeId: number) => ({
        method: HttpMethod.GET,
        path: `/api/challenges/group/${challengeId}/verifications`,
      }),

      // 인증 제출 (생성)
      SUBMIT: (challengeId: number) => ({
        method: HttpMethod.POST,
        path: `/api/challenges/group/${challengeId}/verifications`,
      }),

      // 인증 결과 조회 (롱폴링)
      RESULT: (challengeId: number) => ({
        method: HttpMethod.GET,
        path: `/api/challenges/group/${challengeId}/verification/result`,
      }),

      LIKES: {
        // 좋아요 추가
        CREATE: (challengeId: number, verificationId: number) => ({
          method: HttpMethod.POST,
          path: `/api/challenges/group/${challengeId}/verifications/${verificationId}/likes`,
        }),
        // 좋아요 삭제
        DELETE: (challengeId: number, verificationId: number) => ({
          method: HttpMethod.DELETE,
          path: `/api/challenges/group/${challengeId}/verifications/${verificationId}/likes`,
        }),
      },

      //인증 상세 조회
      DETAILS: (challengeId: number, verificationId: number) => ({
        method: HttpMethod.GET,
        path: `/api/challenges/group/${challengeId}/verifications/${verificationId}`,
      }),
      //인증 상세 댓글
      COMMENT: {
        //댓글 조회
        LIST: (challengeId: number, verificationId: number) => ({
          method: HttpMethod.GET,
          path: `/api/challenges/group/${challengeId}/verifications/${verificationId}/comments`,
        }),
        //댓글 생성
        CREATE: (challengeId: number, verificationId: number) => ({
          method: HttpMethod.POST,
          path: `/api/challenges/group/${challengeId}/verifications/${verificationId}/comments`,
        }),
        //댓글/대댓글 수정
        MODIFY: (challengeId: number, verificationId: number, commentId: number) => ({
          method: HttpMethod.PUT,
          path: `/api/challenges/group/${challengeId}/verifications/${verificationId}/comments/${commentId}`,
        }),
        //댓글/대댓글 삭제
        DELETE: (challengeId: number, verificationId: number, commentId: number) => ({
          method: HttpMethod.DELETE,
          path: `/api/challenges/group/${challengeId}/verifications/${verificationId}/comments/${commentId}`,
        }),
        //대댓글 생성
        REPLY: (challengeId: number, verificationId: number, commentId: number) => ({
          method: HttpMethod.POST,
          path: `/api/challenges/group/${challengeId}/verifications/${verificationId}/comments/${commentId}/replies`,
        }),
      },
    },

    // 인증 내역 목록 조회 (피드) - 무작위 챌린지
    FEED: {
      method: HttpMethod.GET,
      path: `/api/challenges/group/verifications`,
    },
  },

  ETC: {
    COUNT: {
      // 누적 사용자 인증수 조회
      VERIFICATION: { method: HttpMethod.GET, path: `/api/challenges/verifications/count` },
    },
  },
}

const a = {
  1: 2,
  2: 3,
  3: 4,
}

const MEMBER_ENDPOINTS = {
  AUTH: {
    LOGIN: (provider: LowercaseOAuthType) => ({ method: HttpMethod.GET, path: `/oauth/${provider}` }), // OAuth 로그인 시작
    CALLBACK: (provider: LowercaseOAuthType) => ({ method: HttpMethod.GET, path: `/oauth/${provider}/callback` }), // OAuth 콜백
    LOGOUT: (provider: LowercaseOAuthType) => ({
      method: HttpMethod.DELETE,
      path: `/oauth/${provider}/token`,
    }),
    RE_ISSUE: { method: HttpMethod.POST, path: '/oauth/token/reissue' }, // 토큰 재발급
  },

  DUPLICATE_NICKNAME: { method: HttpMethod.GET, path: '/api/members/nickname' }, // 닉네임 중복 검사

  // CRUD
  SIGNUP: { method: HttpMethod.POST, path: '/api/members' }, // 회원가입
  DETAILS: { method: HttpMethod.GET, path: '/api/members' }, // 회원 정보 조회
  MODIFY: { method: HttpMethod.PATCH, path: '/api/members' }, // 회원정보 수정
  UNREGISTER: { method: HttpMethod.DELETE, path: '/api/members' }, // 회원 탈퇴

  // 회원 정보
  PROFILE_CARD: { method: HttpMethod.GET, path: '/api/members/profilecard' }, // 프로필 카드 조회
  LEAVES: { method: HttpMethod.GET, path: '/api/members/leaves' }, // 나뭇잎 보유량 조회

  FEEDBACK: {
    GET_FEEDBACK: { method: HttpMethod.GET, path: '/api/members/feedback' }, // 챌린지 피드백 조회
    POST_FEEDBACK: { method: HttpMethod.POST, path: '/api/members/feedback' }, //피드백 생성 요청
    RESULT: { method: HttpMethod.GET, path: '/api/members/feedback/result' }, //피드백 결과 조회(롱폴링)
  },

  BADGES: {
    LIST: { method: HttpMethod.GET, path: '/api/members/badges' }, // 뱃지 조회
    RECENT: { method: HttpMethod.GET, path: '/api/members/badges/recent' }, //최근 획득 뱃지 조회
  },

  // 알림
  NOTIFICATION: {
    // TODO: UTC 체크
    LIST: { method: HttpMethod.GET, path: '/api/members/notifications' }, // 알림 조회
    READ: { method: HttpMethod.PATCH, path: '/api/members/notifications' }, // 알림 읽음 처리
  },

  // 나뭇잎 상점
  STORE: {
    ORDERS: {
      // TODO: UTC 체크
      LIST: { method: HttpMethod.GET, path: '/api/members/products/list' }, // 구매 내역
    },
  },

  /** 챌린지 */
  CHALLENGE: {
    GROUP: {
      // TODO: UTC 체크
      CREATIONS: { method: HttpMethod.GET, path: '/api/members/challenges/group/creations' }, // 생성한 챌린지

      // 참여한 단체 챌린지 목록 조회
      // TODO: UTC 체크
      PARTICIPATIONS: {
        method: HttpMethod.GET,
        path: '/api/members/challenges/group/participations',
      },

      // 참여한 단체 챌린지 인증 내역을 일별로 조회
      VERIFICATIONS: (challengeId: number) => ({
        method: HttpMethod.GET,
        path: `/api/members/challenges/group/participations/${challengeId}/verifications`,
      }),
      // 참여한 단체 챌린지 카운트 조회 (인증 페이지)
      COUNT: {
        method: HttpMethod.GET,
        path: `/api/members/challenges/group/participations/count`,
      },
    },
  },
}

// DEPRECATED
const S3_ENDPOINTS = {
  // 이미지 업로드용 Presigned URL 요청
  PRESIGNED_URL: { method: HttpMethod.POST, path: '/s3/images/presigned-url' },

  // 이미지 실제 업로드 (PUT) - Presigned Url을 사용
  // UPLOAD: { method: HttpMethod.PUT, path: '/s3/images' },
}

const STORE_ENDPOINTS = {
  TIME_DEAL: {
    // 타임딜 상품 목록
    // TODO: UTC 체크
    LIST: { method: HttpMethod.GET, path: '/api/store/products/timedeals' },
    // 타임딜 상품 주문
    ORDER: (dealId: number) => ({
      method: HttpMethod.POST,
      path: `/api/orders/timedeals/${dealId}`,
    }),
  },
  PRODUCTS: {
    // 일반 상품 목록
    LIST: { method: HttpMethod.GET, path: '/api/store/products' },
    // 상품 주문
    ORDER: (productId: number) => ({
      method: HttpMethod.POST,
      path: `/api/orders/products/${productId}`,
    }),
  },
  ETC: {
    COUNT: {
      // 누적 나뭇잎 수 조회
      LEAVES: { method: HttpMethod.GET, path: '/api/leaves/count' },
    },
  },
}

const CHATBOT_ENDPOINTS = {
  // 카테고리 기반 챌린지 추천 요청 (일반)
  CATEGORY: { method: HttpMethod.POST, path: '/api/chatbot/recommendation/base-info' },
  // 자유 텍스트 기반 챌린지 추천 요청 (일반)
  CHATTING: { method: HttpMethod.POST, path: '/api/chatbot/recommendation/free-text' },
}

export const ENDPOINTS = {
  CHALLENGE: CHALLENGE_ENDPOINTS,
  MEMBERS: MEMBER_ENDPOINTS,
  STORE: STORE_ENDPOINTS,
  CHATBOT: CHATBOT_ENDPOINTS,
  S3: S3_ENDPOINTS,
} as const
