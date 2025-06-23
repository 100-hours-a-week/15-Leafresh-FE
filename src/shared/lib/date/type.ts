import { DAY_PAIRS } from './consts'

/** 요일 */
export type DayType = (typeof DAY_PAIRS)[number]['eng']
export type DayTypeKor = (typeof DAY_PAIRS)[number]['kor']

/** 언어쌍 구조 */
export type LanguageMap = { kor: string; eng: string }
