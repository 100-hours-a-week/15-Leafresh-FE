/** 인증 성공 여부 */
export const OAuth = ['KAKAO'] as const // 대문자
export const LowercaseOAuth = OAuth.map(v => v.toLowerCase()) as Lowercase<(typeof OAuth)[number]>[] // 소문자

export const treeLevelMap: Record<number, string> = {
  1: '새싹',
  2: '묘목',
  3: '작은 나무',
  4: '나무',
  5: '큰 나무',
  6: '???',
}
