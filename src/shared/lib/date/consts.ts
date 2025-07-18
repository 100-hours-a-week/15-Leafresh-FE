/** 요일 */
export const DAY_PAIRS = [
  { kor: '일', eng: 'SUNDAY' },
  { kor: '월', eng: 'MONDAY' },
  { kor: '화', eng: 'TUESDAY' },
  { kor: '수', eng: 'WEDNESDAY' },
  { kor: '목', eng: 'THURSDAY' },
  { kor: '금', eng: 'FRIDAY' },
  { kor: '토', eng: 'SATURDAY' },
] as const

export const DAYS = DAY_PAIRS.map(pair => pair.eng)
export const DAYS_KOR = DAY_PAIRS.map(pair => pair.kor)
