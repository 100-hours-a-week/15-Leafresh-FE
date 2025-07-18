import { useMutation } from '@tanstack/react-query'

import {
  CreateChallenge,
  CreateVerificationLike,
  DeleteGroupChallenge,
  deleteVerificationComment,
  DeleteVerificationLike,
  ModifyChallenge,
  ParticipateGroupChallenge,
  PostGroupVerification,
  postVerificationComment,
  postVerificationReply,
  putVerificationComment,
  VerifyGroupChallenge,
} from '@/entities/challenge/api'
import {
  ChallengeStatus,
  Logout,
  PatchMemberInfo,
  readAllAlarms,
  RequestFeedback,
  SignUp,
  Unregister,
} from '@/entities/member/api'
import { OrderProduct, OrderTimeDealProduct } from '@/entities/store/api'

import { ApiResponse, ErrorResponse, handleError } from '@/shared/lib'

import { MUTATION_KEYS } from './mutation-keys'
import { getQueryClient } from './query-client'
import { QUERY_KEYS } from './query-keys'

const queryClient = getQueryClient()

/**
 * 참고
 * data: mutate return value
 * variables: mutate 인자
 */

/** 개인 챌린지 */
// 인증 제출
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.PERSONAL.VERIFICATION.SUBMIT, {
  mutationFn: VerifyGroupChallenge,
  onSuccess(data, variables, context) {
    const { challengeId } = variables
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.DETAILS(challengeId) }) // 개인 챌린지 상세 조회

    //뱃지 목록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.BADGES.LIST,
    })

    //프로필 카드
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.PROFILE_CARD,
    })
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

/** 단체 챌린지 */
// 생성
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.CREATE, {
  mutationFn: CreateChallenge,
  onSuccess(data, variables, context) {
    // 모든 단체 첼린지 목록 조회 (검색 포함) 쿼리 무효화
    queryClient.invalidateQueries({
      predicate: query =>
        Array.isArray(query.queryKey) && query.queryKey[0] === 'challenges' && query.queryKey[1] === 'group',
    })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.CREATIONS }) // 생성한 단체 챌린지 목록 조회
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.COUNT }) // 참여한 단체 챌린지 카운트 조회 (인증페이지)
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 수정
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.MODIFY, {
  mutationFn: ModifyChallenge,
  onSuccess(data, variables, context) {
    const { challengeId } = variables

    // 모든 단체 첼린지 목록 조회 (검색 포함) 쿼리 무효화
    queryClient.invalidateQueries({
      predicate: query =>
        Array.isArray(query.queryKey) && query.queryKey[0] === 'challenges' && query.queryKey[1] === 'group',
    })

    // 단체 챌린지 상세 조회
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId) })

    // 생성한 단체 챌린지 목록
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.CREATIONS })

    // 참여한 단체 챌린지 카운트 조회
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.COUNT })
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 삭제
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.DELETE, {
  mutationFn: DeleteGroupChallenge,
  onSuccess(data, variables, context) {
    const { challengeId } = variables

    // 모든 단체 첼린지 목록 조회 (검색 포함) 쿼리 무효화
    queryClient.invalidateQueries({
      predicate: query =>
        Array.isArray(query.queryKey) && query.queryKey[0] === 'challenges' && query.queryKey[1] === 'group',
    })

    // 단체 챌린지 상세 조회
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId) })

    // 생성한 단체 챌린지 목록
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.CREATIONS })

    // 참여한 단체 챌린지 카운트 조회
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.COUNT })
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 참여
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.PARTICIPATE, {
  mutationFn: ParticipateGroupChallenge,
  onSuccess(data, variables, context) {
    const { challengeId } = variables

    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId) }) // 단체 챌린지 상세 조회
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS(status as ChallengeStatus),
    }) // member - 참여한 단체 챌린지 목록 조회
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 인증 제출 (단체)
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.SUBMIT, {
  mutationFn: PostGroupVerification,
  onSuccess(data, variables, context) {
    const { challengeId } = variables

    //단체 챌린지 상세
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
    })

    //인증 규약
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.RULES(challengeId),
    })

    //인증 결과
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.RESULT(challengeId),
    })

    //인증 내역 목록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.LIST(challengeId),
    })

    //챌린지 일별 인증 기록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeId),
    })

    //참여한 단체 챌린지 목록 -> 성공률
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS(status as ChallengeStatus),
    })

    //알림 목록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.NOTIFICATION.LIST,
    })

    //뱃지 목록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.BADGES.LIST,
    })

    //최근 획득 뱃지 목록
    queryClient.invalidateQueries({
      predicate: query => JSON.stringify(query.queryKey)?.startsWith(`["member","badges","recent"`),
    })

    //프로필 카드
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.PROFILE_CARD,
    })
  },

  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

/** 인증 도메인 */

// 좋아요 추가
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.LIKES.CREATE, {
  mutationFn: CreateVerificationLike,
  onSuccess(data, variables, context) {},
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 좋아요 삭제
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.LIKES.DELETE, {
  mutationFn: DeleteVerificationLike,
  onSuccess(data, variables, context) {},

  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

//댓글 생성
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.CREATE, {
  mutationFn: postVerificationComment,
  onSuccess(data, variables, context) {
    const { challengeId, verificationId } = variables
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT(challengeId, verificationId),
    })
  },
})

//대댓글 생성
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.CREATE, {
  mutationFn: postVerificationReply,
  onSuccess(data, variables, context) {
    const { challengeId, verificationId } = variables
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT(challengeId, verificationId),
    })
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

//댓글/대댓글 삭제
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.DELETE, {
  mutationFn: deleteVerificationComment,
  onSuccess(data, variables, context) {
    const { challengeId, verificationId } = variables
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT(challengeId, verificationId),
    })
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

//댓글/대댓글 수정
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.MODIFY, {
  mutationFn: putVerificationComment,
  onSuccess(data, variables, context) {
    const { challengeId, verificationId } = variables
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT(challengeId, verificationId),
    })
  },
})

/** 멤버 도메인 */
// 로그아웃
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.AUTH.LOGOUT, {
  mutationFn: Logout,
  onSuccess() {
    const MEMBER_QUERIES = ['member']
    queryClient.invalidateQueries({ queryKey: MEMBER_QUERIES }) // 유저에 종속되는 모든 멤버키 무효화
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 토큰 재발급
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.AUTH.RE_ISSUE, {
  // TODO: 토큰 재발급 API 연결
  onSuccess() {
    // TODO: 무효화 로직
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 회원가입
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.SIGNUP, {
  mutationFn: SignUp,
  onSuccess() {
    // 무효화 로직 없음
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 회원정보 수정
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.MODIFY, {
  mutationFn: PatchMemberInfo,
  onSuccess() {
    //프로필 카드
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.PROFILE_CARD,
    })

    //회원 정보
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.DETAILS,
    })
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 회원탈퇴
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.UNREGISTER, {
  mutationFn: Unregister,
  onSuccess() {
    const MEMBER_QUERIES = ['member']
    queryClient.invalidateQueries({ queryKey: MEMBER_QUERIES }) // 유저에 종속되는 모든 멤버키 무효화
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

//피드백 생성 요청
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.FEEDBACK.POST_FEEDBACK, {
  mutationFn: RequestFeedback,
  onSuccess() {
    //사용자 피드백
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.FEEDBACK.GET_FEEDBACK,
    })

    //피드백 요청 결과
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.FEEDBACK.RESULT,
    })
  },
})

// 알림 읽음
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.NOTIFICATION.READ, {
  mutationFn: readAllAlarms,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.NOTIFICATION.LIST })
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

/** 나뭇잎 상점 */
// 타임딜 상품 주문 생성
queryClient.setMutationDefaults(MUTATION_KEYS.STORE.TIME_DEAL.ORDER, {
  mutationFn: OrderTimeDealProduct,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STORE.TIME_DEAL.LIST }) // 타임딜 상품 목록 조회
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 일반 상품 주문 생성
queryClient.setMutationDefaults(MUTATION_KEYS.STORE.PRODUCTS.ORDER, {
  mutationFn: OrderProduct,
  onSuccess() {
    const PRODUCT_QUERIES = ['store', 'products']
    queryClient.invalidateQueries({ queryKey: PRODUCT_QUERIES }) // 일반 상품 상품 목록 조회
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

export const useMutationStore = <TData, TVariables>(mutationKey: readonly unknown[]) => {
  return useMutation<ApiResponse<TData>, ErrorResponse, TVariables, unknown>({ mutationKey })
}
