import { DAYS_KOR } from '@entities/challenge/constant'
import { DayType } from '@entities/challenge/type'

/**
 * 요일 인덱스(일: 0, 월: 1, … 토: 6)를 통해 한글 요일로 반환
 */
export const dayToString = (dayIndex: number): string => {
  return DAYS_KOR[dayIndex]
}

/**
 * 영어 요일 입력 ("SUNDAY" | "MONDAY" | ... )을 한글 요일로 반환
 */
export const convertDayToLabel = (day: DayType) => {
  switch (day) {
    case 'SUNDAY':
      return DAYS_KOR[0]
    case 'MONDAY':
      return DAYS_KOR[1]
    case 'TUESDAY':
      return DAYS_KOR[2]
    case 'WEDNESDAY':
      return DAYS_KOR[3]
    case 'THURSDAY':
      return DAYS_KOR[4]
    case 'FRIDAY':
      return DAYS_KOR[5]
    case 'SATURDAY':
      return DAYS_KOR[6]
  }
}
