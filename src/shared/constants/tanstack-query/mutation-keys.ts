const CHALLENGE_MUTATION_KEYS = {
  /** 개인 챌린지 */
  PERSONAL: {
    // 인증 제출
    VERIFY: (challengeId: number) => `[challenges, personal, ${challengeId}, verify]`,
  },

  /** 단체 챌린지 */
  GROUP: {
    // 생성
    CREATE: (challengeId: number) => `[challenges, group, ${challengeId}, create]`,
    // 수정
    UPDATE: (challengeId: number) => `[challenges, group, ${challengeId}, modify]`,

    // 삭제
    DELETE: (challengeId: number) => `[challenges, group, ${challengeId}, delete]`,

    // 참여 이력 생성
    PARTICIPATE: (challengeId: number) => `[challenges, group, ${challengeId}, participate]`,

    // 인증 제출 (생성)
    VERIFY: (challengeId: number) => `[challenges, group, ${challengeId}, verify]`,
  },
}
const MEMBER_MUTATION_KEYS = {
  AUTH: {
    LOGOUT: `[member, logout]`, // 리프레시 토큰 제거
    RE_ISSUE: `[member, token, reissue]`, // 토큰 재발급
  },

  // CRUD
  SIGNUP: `[member, signup]`, // 회원가입
  MODIFY: `[member, info]`, // 회원정보 수정
  UNREGISTER: `[member, unregister]`, // 회원 탈퇴

  // 알림
  NOTIFICATION: {
    READ: `[member, notifications, read]`, // 알림 읽음 처리
  },
}
// const POST_MUTATION_KEYS = {}
const STORE_MUTATION_KEYS = {
  TIME_DEAL: {
    // 타임딜 상품 주문
    ORDER: (productId: number) => `[store, order, product, timedeal, ${productId}]`,
  },
  PRODUCTS: {
    // 상품 주문
    ORDER: (productId: number) => `[store, order, product, ${productId}]`,
  },
}

/*
 * POST DELETE PATCH PUT
 * Mutation Keys to use Mutations convenient
 */
export const MUTATION_KEYS = {
  CHALLENGE: CHALLENGE_MUTATION_KEYS,
  MEMBER: MEMBER_MUTATION_KEYS,
  STORE: STORE_MUTATION_KEYS,
  // POST: POST_MUTATION_KEYS,
}
