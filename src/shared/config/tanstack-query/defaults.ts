import { useMutation } from '@tanstack/react-query'

import { CreateChallenge } from '@features/challenge/api/create-group-challenge'
import { PostGroupVerification } from '@features/challenge/api/participate/verification/group-verification'
import { ParticipateGroupChallenge } from '@features/challenge/api/participate-group-challenge'
import { VerifyGroupChallenge } from '@features/challenge/api/verify-personal-challenge'
import { Logout } from '@features/member/api/logout'
import { SignUp } from '@features/member/api/signup'
import { Unregister } from '@features/member/api/unregister'
import { ApiResponse } from '@shared/lib/api/fetcher/fetcher'

import { MUTATION_KEYS } from './mutation-keys'
import { getQueryClient } from './queryClient'

const queryClient = getQueryClient()

/** 개인 챌린지 */
// 인증 제출
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.PERSONAL.VERIFY, {
  mutationFn: VerifyGroupChallenge,
  onSuccess(data, variables, context) {
    // TODO: 무효화 로직
  },
})

/** 단체 챌린지 */
// 생성
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.CREATE, {
  mutationFn: CreateChallenge,
  onSuccess(data, variables, context) {
    // TODO: 무효화 로직
  },
})

// 수정
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.UPDATE, {
  mutationFn: async variables => {
    // TODO: 수정 API 연결
    return {} as ApiResponse<unknown>
  },
  onSuccess(data, variables, context) {
    // TODO: 무효화 로직
  },
})

// 삭제
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.DELETE, {
  mutationFn: async variables => {
    // TODO: 삭제 API 연결
    return {} as ApiResponse<unknown>
  },
  onSuccess(data, variables, context) {
    // TODO: 무효화 로직
  },
})

// 참여
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.PARTICIPATE, {
  mutationFn: ParticipateGroupChallenge,
  onSuccess(data, variables, context) {
    // TODO: 무효화 로직
  },
})

// 인증 제출 (단체)
queryClient.setMutationDefaults(MUTATION_KEYS.CHALLENGE.GROUP.VERIFY, {
  mutationFn: PostGroupVerification,
  onSuccess(data, variables, context) {
    // TODO: 무효화 로직
  },
})

/** 멤버 도메인 */
// 로그아웃
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.AUTH.LOGOUT, {
  mutationFn: Logout,
  onSuccess() {
    // TODO: 무효화 로직
  },
})

// 토큰 재발급
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.AUTH.RE_ISSUE, {
  // TODO: 토큰 재발급 API 연결
  onSuccess() {
    // TODO: 무효화 로직
  },
})

// 회원가입
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.SIGNUP, {
  mutationFn: SignUp,
  onSuccess() {
    // TODO: 회원가입 후 무효화 로직
    return {} as ApiResponse<unknown>
  },
})

// 수정
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.SIGNUP, {
  // TODO: 수정 API 연결
  onSuccess() {
    // TODO: 수정 후 무효화 로직
    return {} as ApiResponse<unknown>
  },
})

// 회원탈퇴
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.UNREGISTER, {
  mutationFn: Unregister,
  onSuccess() {
    // TODO: 무효화 로직
  },
})

// 알림 읽음
queryClient.setMutationDefaults(MUTATION_KEYS.MEMBER.NOTIFICATION.READ, {
  mutationFn: async () => {
    // TODO: 알림 읽음 API 연결
    return {} as ApiResponse<unknown>
  },
  onSuccess() {
    // TODO: 알림 목록 무효화
  },
})

/**
 * TODO: (V2) 게시판
 * TODO: (V2) 나뭇잎 상점
 */

export const useMutationStore = <TData, TVariables>(mutationKey: readonly unknown[]) => {
  return useMutation<ApiResponse<TData>, Error, TVariables, unknown>({ mutationKey })
}
