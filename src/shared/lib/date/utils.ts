import { DAYS, DAYS_KOR } from '@entities/challenge/constant'
import { DayType } from '@entities/challenge/type'
import { DateFormatString } from '@shared/types/date'

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

/**
 * Date 객체를 "YYYY-mm-dd" 형태로 변환하는 함수
 */
export const formatDateToDateFormatString = (date: Date): DateFormatString => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}` as DateFormatString
}

/**
 * 금일을 "MONDAY" | "TUESDAY" | ... | "SUNDAY" 형식으로 변환
 */
export const getDayOfWeek = (date: Date): DayType => {
  return DAYS[date.getDay()]
}
