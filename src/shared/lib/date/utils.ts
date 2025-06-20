import { DAYS, DAYS_KOR } from './consts'
import { DayType } from './type'

import { DateFormatString, ISOFormatString } from '@/shared/type'

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

/**
 * 초(second) 를 "00:00:00" 형식으로 변환
 */
export const formatSecondToTime = (second: number): string => {
  const hours = String(Math.floor(second / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((second % 3600) / 60)).padStart(2, '0')
  const seconds = String(second % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

/**
 * ISOFormat 형식의 시간 데이터를 기준으로 몇분 전인지 표시해주는 유틸 함수
 * @param dateString
 * @returns
 */
export const getTimeDiff = (dateString: ISOFormatString): string => {
  const now = new Date()
  const target = new Date(dateString)

  const diffMs = now.getTime() - target.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeek = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
  const diffMonth = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7 * 30))
  const diffYear = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7 * 30 * 12))

  // 1분 이내
  if (diffMin < 1) {
    return `방금`
  }
  // 1시간 이내
  if (diffMin < 60) {
    return `${diffMin}분 전`
  }

  // 하루 이내
  if (diffHour < 24) {
    return `${diffHour}시간 전`
  }

  // 이틀 이내
  if (diffDay < 2) {
    return `어제`
  }

  // 일주일 이내
  if (diffDay < 7) {
    return `${diffDay}일 전`
  }

  //한달 이내
  if (diffWeek < 4) {
    return `${diffWeek}주 전`
  }

  if (diffMonth < 12) {
    return `${diffMonth}달 전`
  }

  return `${diffYear}년 전`
}

/**
 * KST 기준 자정을 UTC ISO 문자열로 변환
 * @param date 로컬 Date 객체
 * @returns ISO 문자열 (ex: "2025-06-17T00:00:00Z" ← 한국 기준 자정)
 */
export function getKstMidnightToUtcISOString(date: Date): ISOFormatString {
  // 1. 연/월/일 추출
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  // 2. 한국(KST) 자정 문자열 생성
  const kstDateTimeString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00+09:00`

  // 3. Date 객체 생성 후 UTC로 변환
  const utcDate = new Date(kstDateTimeString)

  return utcDate.toISOString() as ISOFormatString
}

/**
 * ISO 형식의 데이터에서 날짜만을 추출하는 방식
 * @param iso ISO 형식 시간 (2025-06-17T00:00:00Z)
 * @returns 날짜 (YYYY-MM-dd)
 */
export function extractDateFromISOInKST(iso: ISOFormatString): string {
  return new Date(iso).toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Seoul',
  })
}
