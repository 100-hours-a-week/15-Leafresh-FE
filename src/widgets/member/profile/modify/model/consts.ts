import { z } from 'zod'

export const maxLength = 20

export const profileSchema = z.object({
  nickname: z.string().max(20, '닉네임은 최대 20자까지 입력 가능합니다.').optional(),
  imageUrl: z.string().url().optional(),
})
