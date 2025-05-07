/** 인증 성공 여부 */
export const OAuth = ['KAKAO'] as const // 대문자
export const LowercaseOAuth = OAuth.map(v => v.toLowerCase()) as Lowercase<(typeof OAuth)[number]>[] // 소문자
