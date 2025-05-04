/** 인증 성공 여부 */
export const CHALLENGE_VERIFICATION_RESULT = ['SUCCESS', 'FAILURE'] as const

/** 인증 상태 */
export const CHALLENGE_VERIFICATION_STATUS = [
  'NOT_SUBMITTED',
  'PENDING_APPROVAL',
  ...CHALLENGE_VERIFICATION_RESULT,
] as const

/** 요일 */
export const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

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
