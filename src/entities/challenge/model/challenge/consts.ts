import { LanguageMap } from '@entities/common'

import { ChallengeCategoryType, ChallengeCategoryTypeKor } from './types'

/** 카테고리 */
export const CHALLENGE_CATEGORY_PAIRS: LanguageMap[] = [
  { kor: '제로웨이스트', eng: 'ZERO_WASTE' },
  { kor: '플로깅', eng: 'PLOGGING' },
  { kor: '탄소 발자국', eng: 'CARBON_FOOTPRINT' },
  { kor: '에너지 절약', eng: 'ENERGY_SAVING' },
  { kor: '업사이클', eng: 'UPCYCLING' },
  { kor: '문화 공유', eng: 'MEDIA' },
  { kor: '디지털 탄소', eng: 'DIGITAL_CARBON' },
  { kor: '비건', eng: 'VEGAN' },
  { kor: '기타', eng: 'ETC' },
] as const

export const CHALLENGE_CATEGORIES: ChallengeCategoryType[] = CHALLENGE_CATEGORY_PAIRS.map(pair => pair.eng)
export const CHALLENGE_CATEGORIES_KOR: ChallengeCategoryTypeKor[] = CHALLENGE_CATEGORY_PAIRS.map(pair => pair.kor)

/** 최대 인원 */
export const PARTICIPANT_RANGE = {
  MIN: 10, // 최소
  MAX: 100, // 최대
  RANGE: 10, // 간격
}
