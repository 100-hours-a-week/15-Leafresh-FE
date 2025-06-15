import { z } from 'zod'

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

// 뱃지 카테고리 상수
export interface Category {
  key: string
  name: string
}

export const badgeCategory: Category[] = [
  { key: 'group', name: '그룹' },
  { key: 'personal', name: '개인' },
  { key: 'total', name: '총합' },
  { key: 'special', name: '특별' },
  { key: 'event', name: '이벤트' },
]

export const signupSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
})

export type SignupFormType = z.infer<typeof signupSchema>
