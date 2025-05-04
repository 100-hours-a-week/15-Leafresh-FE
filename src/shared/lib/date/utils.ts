import { KOR_DAYS } from '@entities/challenge/constant'
import { DayType } from '@entities/challenge/type'

/**
 * 요일 인덱스(일: 0, 월: 1, … 토: 6)를 통해 한글 요일로 반환
 */
export const dayToString = (dayIndex: number): string => {
  return KOR_DAYS[dayIndex]
}

/**
 * 영어 요일 입력 ("SUNDAY" | "MONDAY" | ... )을 한글 요일로 반환
 */
export const convertDayToLabel = (day: DayType) => {
  switch (day) {
    case 'SUNDAY':
      return KOR_DAYS[0]
    case 'MONDAY':
      return KOR_DAYS[1]
    case 'TUESDAY':
      return KOR_DAYS[2]
    case 'WEDNESDAY':
      return KOR_DAYS[3]
    case 'THURSDAY':
      return KOR_DAYS[4]
    case 'FRIDAY':
      return KOR_DAYS[5]
    case 'SATURDAY':
      return KOR_DAYS[6]
  }
}
