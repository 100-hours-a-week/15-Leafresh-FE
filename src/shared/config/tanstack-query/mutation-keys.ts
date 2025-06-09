const CHALLENGE_MUTATION_KEYS = {
  /** 개인 챌린지 */
  PERSONAL: {
    VERIFY: ['challenges', 'personal', 'verify'] as const, // 인증 제출
  },

  /** 단체 챌린지 */
  GROUP: {
    CREATE: ['challenges', 'group', 'create'] as const, // 생성
    MODIFY: ['challenges', 'group', 'modify'] as const, // 수정
    DELETE: ['challenges', 'group', 'delete'] as const, // 삭제
    PARTICIPATE: ['challenges', 'group', 'participate'] as const, // 참여
    VERIFY: {
      SUBMIT: ['challenges', 'group', 'verify'] as const, // 인증 제출
      COMMENT: {
        CREATE: ['challenges', 'group', 'verify', 'comment', 'create'] as const, //댓글 작성
        REPLY: {
          CREATE: ['challenges', 'group', 'verify', 'comment', 'reply', 'create'] as const, //대댓글 작성
          DELETE: ['challenges', 'group', 'verify', 'comment', 'reply', 'delete'] as const, //댓글/대댓글 삭제
          MODIFY: ['challenges', 'group', 'verify', 'comment', 'reply', 'modify'] as const, //댓글/대댓글 수정
        },
      },
    },
  },
}

const MEMBER_MUTATION_KEYS = {
  AUTH: {
    LOGOUT: ['member', 'logout'] as const,
    RE_ISSUE: ['member', 'token', 'reissue'] as const,
  },

  SIGNUP: ['member', 'signup'] as const,
  MODIFY: ['member', 'info'] as const,
  UNREGISTER: ['member', 'unregister'] as const,

  NOTIFICATION: {
    READ: ['member', 'notifications', 'read'] as const,
  },
}

const STORE_MUTATION_KEYS = {
  TIME_DEAL: {
    ORDER: ['store', 'order', 'product', 'timedeal'] as const,
  },
  PRODUCTS: {
    ORDER: ['store', 'order', 'product'] as const,
  },
}

export const MUTATION_KEYS = {
  CHALLENGE: CHALLENGE_MUTATION_KEYS,
  MEMBER: MEMBER_MUTATION_KEYS,
  STORE: STORE_MUTATION_KEYS,
  // POST: POST_MUTATION_KEYS,
} as const
