/** 챌린지 인증 성공 여부 */
export const CHALLENGE_VERIFICATION_RESULT = [
  'SUCCESS', // 성공
  'FAILURE', // 실패
] as const

/** 챌린지 인증 상태 */
export const CHALLENGE_VERIFICATION_STATUS = [
  'NOT_SUBMITTED', // 제출 안함
  'PENDING_APPROVAL', // 인증 확인 중
  'DONE', // 성공, 실패 여부 상관없이 제출함
  ...CHALLENGE_VERIFICATION_RESULT,
] as const
