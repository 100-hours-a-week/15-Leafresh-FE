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

    // 규칙
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
    DETAILS: (challengeId: number) => ({
      method: HttpMethod.GET,
      path: `/api/challenges/group/${challengeId}`,
    }),
    // 목록
    LIST: { method: HttpMethod.GET, path: '/api/challenges/group' },
    // 생성
    CREATE: { method: HttpMethod.POST, path: '/api/challenges/group' },
    // 수정
    MODIFY: (challengeId: number) => ({
      method: HttpMethod.PATCH,
      path: `/api/challenges/group/${challengeId}`,
    }),

    // 삭제
    DELETE: (challengeId: number) => ({
      method: HttpMethod.DELETE,
      path: `/api/challenges/group/${challengeId}`,
    }),

    // 규약
    RULES: (challengeId: number) => ({
      method: HttpMethod.GET,
      path: `/api/challenges/group/${challengeId}/rules`,
    }),

    // 참여
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

      // TODO: 인증 상세 조회
      DETAILS: {},

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

      COMMENT: {
        // TODO: 댓글 목록 조회 (댓글 + 대댓글 포함)
        LIST: {},
        // TODO: 댓글 생성
        CREATE: {},
        // TODO: 댓글 수정
        MODIFY: {},
        // TODO: 댓글 삭제 (대댓글 포함)
        DELETE: {},
        REPLY: {
          // TODO: 대댓글 생성
          CREATE: {},
          // TODO: 대댓글 수정
          MODIFY: {},
        },
      },
    },
  },
}

const MEMBER_ENDPOINTS = {
  AUTH: {
    LOGIN: (provider: LowercaseOAuthType) => ({ method: HttpMethod.GET, path: `/oauth/${provider}` }), // OAuth 로그인 시작
    CALLBACK: (provider: LowercaseOAuthType) => ({ method: HttpMethod.GET, path: `/oauth/${provider}/callback` }), // OAuth 콜백
    LOGOUT: (provider: LowercaseOAuthType) => ({
      method: HttpMethod.DELETE,
      path: `/oauth/${provider}/token`,
    }),
    RE_ISSUE: { method: HttpMethod.POST, path: '/auth/token/reissue' }, // 토큰 재발급
  },

  DUPLICATE_NICKNAME: { method: HttpMethod.GET, path: '/api/members/nickname' }, // 닉네임 중복 검사

  // CRUD
  SIGNUP: { method: HttpMethod.POST, path: '/api/members' }, // 회원가입
  DETAILS: { method: HttpMethod.GET, path: '/api/members' }, // 내 정보 조회
  MODIFY: { method: HttpMethod.PATCH, path: '/api/members' }, // 회원정보 수정
  UNREGISTER: { method: HttpMethod.DELETE, path: '/api/members' }, // 회원 탈퇴

  // 회원 정보
  PROFILE_CARD: { method: HttpMethod.GET, path: '/api/members/profilecard' }, // 프로필 카드 조회
  BADGES: { method: HttpMethod.GET, path: '/api/members/badges' }, // 뱃지 조회
  LEAVES: { method: HttpMethod.GET, path: '/api/members/leaves' }, // 나뭇잎 개수 조회
  FEEDBACK: { method: HttpMethod.GET, path: '/api/members/feedback' }, // 챌린지 피드백 조회

  // 알림
  NOTIFICATION: {
    LIST: { method: HttpMethod.GET, path: '/api/members/notifications' }, // 알림 조회
    READ: { method: HttpMethod.PATCH, path: '/api/members/notifications' }, // 알림 읽음 처리
  },

  // 나뭇잎 상점
  PRODUCT: {
    LIST: { method: HttpMethod.GET, path: '/api/members/products/list' }, // 구매 내역
  },

  /** 챌린지 */
  CHALLENGE: {
    GROUP: {
      CREATIONS: { method: HttpMethod.GET, path: '/api/members/challenges/group/creations' }, // 생성한 챌린지
      PARTICIPATIONS: { method: HttpMethod.GET, path: '/api/members/challenges/group/participations' }, // 내가 참여한 챌린지

      // 챌린지 인증 내역
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
    LIST: { method: HttpMethod.GET, path: '/api/store/products/timedeals' },
    // 타임딜 상품 주문
    ORDER: (dealId: number) => ({
      method: HttpMethod.POST,
      path: `/api/orders/${dealId}`,
    }),
  },
  PRODUCTS: {
    // 일반 상품 목록
    LIST: { method: HttpMethod.GET, path: '/api/store/products' },
    // 상품 주문
    ORDER: (productId: number) => ({
      method: HttpMethod.POST,
      path: `/api/orders/${productId}`,
    }),
  },
}

const CHATBOT_ENDPOINTS = {
  // 카테고리 기반 챌린지 추천 요청 (일반)
  CATEGORY: { method: HttpMethod.POST, path: '/api/chatbot/recommendation/base-info' },
  // 자유 텍스트 기반 챌린지 추천 요청 (일반)
  CHATTING: { method: HttpMethod.POST, path: '/api/chatbot/recommendation/free-text' },
}

/** 관리자 (v3 개발)*/
// const ADMIN_ENDPOINTS = {
//   CHALLENGE: {
//     EVENT: {
//       // 이벤트 챌린지 생성
//       CREATE: { method: HttpMethod.POST, path: '/api/admin/challenges/event' },
//     },
//     PERSONAL: {
//       // 템플릿
//       TEMPLATE: {
//         GET: { method: HttpMethod.GET, path: '/api/admin/challenges/personal' }, // 조회
//         CREATE: { method: HttpMethod.POST, path: '/api/admin/challenges/personal' }, // 생성
//         // 개인 챌린지 템플릿 수정
//         UPDATE: (templateId: number) => ({
//           method: HttpMethod.PATCH,
//           path: `/api/admin/challenges/personal/${templateId}`,
//         }),
//         // 개인 챌린지 템플릿 삭제
//         DELETE: (templateId: number) => ({
//           method: HttpMethod.DELETE,
//           path: `/api/admin/challenges/personal/${templateId}`,
//         }),
//       },
//       PRODUCT: {
//         // 일반 상품
//         STORE: {
//           // 등록
//           CREATE: { method: HttpMethod.POST, path: '/api/admin/products' },

//           // 수정
//           UPDATE: (productId: number) => ({
//             method: HttpMethod.PATCH,
//             path: `/api/admin/products/${productId}`,
//           }),

//           // 삭제
//           DELETE: (productId: number) => ({
//             method: HttpMethod.DELETE,
//             path: `/api/admin/products/${productId}`,
//           }),
//         },
//         // 타임딜
//         TIME_DEAL: {
//           // 등록ㄴ
//           CREATE: { method: HttpMethod.POST, path: '/api/admin/timedeals' },
//           // 수정
//           UPDATE: (dealId: number) => ({
//             method: HttpMethod.PATCH,
//             path: `/api/admin/timedeals/${dealId}`,
//           }),
//           // 삭제
//           DELETE: (dealId: number) => ({
//             method: HttpMethod.DELETE,
//             path: `/api/admin/timedeals/${dealId}`,
//           }),
//         },
//       },
//     },
//   },
// }

export const ENDPOINTS = {
  CHALLENGE: CHALLENGE_ENDPOINTS,
  MEMBERS: MEMBER_ENDPOINTS,
  STORE: STORE_ENDPOINTS,
  CHATBOT: CHATBOT_ENDPOINTS,
  S3: S3_ENDPOINTS,
  // ADMIN: ADMIN_ENDPOINTS,
} as const
