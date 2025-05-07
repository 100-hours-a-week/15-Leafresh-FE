/** 챌린지 참여 여부 */
export const CHALLENGE_PARTICIPATION_STATUS = ['NOT_STARTED', 'ONGOING', 'COMPLETED']

/** 인증 성공 여부 */
export const CHALLENGE_VERIFICATION_RESULT = [
  'SUCCESS', // 성공
  'FAILURE', // 실패
] as const

/** 인증 상태 */
export const CHALLENGE_VERIFICATION_STATUS = [
  'NOT_SUBMITTED', // 제출 안함
  'PENDING_APPROVAL', // 인증 확인 중
  'DONE', // 성공, 실패 여부 상관없이 제출함
  ...CHALLENGE_VERIFICATION_RESULT,
] as const

/** 요일 */
export const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const
export const KOR_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

/** 카테고리 */
export const CHALLENGE_CATEGORIES = [
  'ZERO_WASTE',
  'PLOGGING',
  'CARBON_FOOTPRINT',
  'ENERGY_SAVING',
  'UPCYCLING',
  'MEDIA',
  'DIGITAL_CARBON',
  'VEGAN',
  'ETC',
] as const
