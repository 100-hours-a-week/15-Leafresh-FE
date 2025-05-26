import { useMutation } from '@tanstack/react-query'

import { CreateChallenge } from '@features/challenge/api/create-group-challenge'
import { DeleteGroupChallenge } from '@features/challenge/api/delete-group-challenge'
import { ModifyChallenge } from '@features/challenge/api/modify-group-challenge'
import { PostGroupVerification } from '@features/challenge/api/participate/verification/group-verification'
import { ParticipateGroupChallenge } from '@features/challenge/api/participate-group-challenge'
import { VerifyGroupChallenge } from '@features/challenge/api/verify-personal-challenge'
import { Logout } from '@features/member/api/logout'
import { readAllAlarms } from '@features/member/api/read-all-alarms'
import { SignUp } from '@features/member/api/signup'
import { Unregister } from '@features/member/api/unregister'
import { ApiResponse, ErrorResponse } from '@shared/lib/api/fetcher/type'

import { MUTATION_KEYS } from './mutation-keys'
import { QUERY_KEYS } from './query-keys'
import { getQueryClient } from './queryClient'
import { handleError } from './utils'

const queryClient = getQueryClient()

/**
 * 참고
 * data: mutate return value
 * variables: mutate 인자
 */

/** 개인 챌린지 */
// 인증 제출
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.PERSONAL.VERIFY, {
  mutationFn: VerifyGroupChallenge,
  onSuccess(data, variables, context) {
    const { challengeId } = variables
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGE.PERSONAL.DETAILS(challengeId) }) // 개인 챌린지 상세 조회
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
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS }) // member - 참여한 단체 챌린지 목록 조회
  },
  onError(error: ErrorResponse, variables, context) {
    handleError(error)
  },
})

// 인증 제출 (단체)
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFY, {
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
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION_RESULT(challengeId),
    })

    //인증 내역 목록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATIONS(challengeId),
    })

    //챌린지 일별 인증 기록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeId),
    })

    //참여한 단체 챌린지 목록 -> 성공률
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.PARTICIPATIONS,
    })

    //알림 목록
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.MEMBER.NOTIFICATION.LIST,
    })
  },

  onError(error: ErrorResponse, variables, context) {
    handleError(error)
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
  // TODO: 수정 API 연결
  onSuccess() {
    // TODO: 수정 후 무효화 로직
    return {} as ApiResponse<unknown>
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

/**
 * TODO: (V2) 게시판
 * TODO: (V2) 나뭇잎 상점
 */

export const useMutationStore = <TData, TVariables>(mutationKey: readonly unknown[]) => {
  return useMutation<ApiResponse<TData>, ErrorResponse, TVariables, unknown>({ mutationKey })
}
