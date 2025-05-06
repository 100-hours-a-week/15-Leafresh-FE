import { ChallengeCategoryType, ChallengeCategoryTypeKor, ConstantPair, DayType, DayTypeKor } from './type'

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
export const DAY_PAIRS: ConstantPair[] = [
  { kor: '일', eng: 'SUNDAY' },
  { kor: '월', eng: 'MONDAY' },
  { kor: '화', eng: 'TUESDAY' },
  { kor: '수', eng: 'WEDNESDAY' },
  { kor: '목', eng: 'THURSDAY' },
  { kor: '금', eng: 'FRIDAY' },
  { kor: '토', eng: 'SATURDAY' },
] as const

export const DAYS: DayType[] = DAY_PAIRS.map(pair => pair.eng)
export const DAYS_KOR: DayTypeKor[] = DAY_PAIRS.map(pair => pair.kor)

/** 카테고리 */
export const CHALLENGE_CATEGORY_PAIRS: ConstantPair[] = [
  { kor: '제로 웨이스트', eng: 'ZERO_WASTE' },
  { kor: '플로깅', eng: 'PLOGGING' },
  { kor: '탄소 발자국', eng: 'CARBON_FOOTPRINT' },
  { kor: '에너지 절약', eng: 'ENERGY_SAVING' },
  { kor: '업사이클링', eng: 'UPCYCLING' },
  { kor: '미디어', eng: 'MEDIA' },
  { kor: '디지털 탄소', eng: 'DIGITAL_CARBON' },
  { kor: '비건', eng: 'VEGAN' },
  { kor: '기타', eng: 'ETC' },
] as const

export const CHALLENGE_CATEGORIES: ChallengeCategoryType[] = CHALLENGE_CATEGORY_PAIRS.map(pair => pair.eng)
export const CHALLENGE_CATEGORIES_KOR: ChallengeCategoryTypeKor[] = CHALLENGE_CATEGORY_PAIRS.map(pair => pair.kor)

/**
 * 한글을 영어로, 영어를 한글로 바꿔주는 함수
 * 예시(영어 to 한글): convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')
 */
export const convertLanguage = <
  T extends readonly Record<string, string>[],
  FromKey extends keyof T[number],
  ToKey extends keyof T[number],
>(
  pairs: T,
  fromKey: FromKey,
  toKey: ToKey,
) => {
  return (fromValue: T[number][FromKey]): T[number][ToKey] | undefined => {
    return (pairs.find((pair: T[number]) => pair[fromKey] === fromValue) as T[number] | undefined)?.[toKey]
  }
}
