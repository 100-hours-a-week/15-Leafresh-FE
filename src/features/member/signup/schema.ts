import { z } from 'zod'

export const signupSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
})

export type SignupFormType = z.infer<typeof signupSchema>
