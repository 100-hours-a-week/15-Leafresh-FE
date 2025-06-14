import { z } from 'zod'

import { PARTICIPANT_RANGE } from '@entities/challenge/model'

// TODO: entities로 옮기기
export const PARTICIPANT_OPTIONS = Array.from(
  { length: Math.floor((PARTICIPANT_RANGE.MAX - PARTICIPANT_RANGE.MIN) / PARTICIPANT_RANGE.RANGE) + 1 },
  (_, i) => PARTICIPANT_RANGE.MIN + i * PARTICIPANT_RANGE.RANGE,
)

export const metaSchema = z.object({
  title: z.string().min(1, '챌린지 제목을 입력해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  startDate: z.date({ required_error: '시작일을 선택해주세요.' }),
  endDate: z.date({ required_error: '종료일을 선택해주세요.' }),
  startTime: z.string().min(1, '시작 시간을 선택해주세요.'),
  endTime: z.string().min(1, '종료 시간을 선택해주세요.'),
  maxParticipant: z.number({ required_error: '최대 인원을 선택해주세요.' }).min(1, '최대 인원을 선택해주세요.'),
  examples: z
    .array(
      z.object({
        id: z.number().optional(), // 상세 포함, 생성 미포함
        url: z.string().nullable(),
        description: z.string(),
        type: z.enum(['SUCCESS', 'FAILURE']),
      }),
    )
    .refine(
      examples => {
        const validSlots = examples.filter(e => e.url !== null)
        const hasSuccess = validSlots.some(e => e.type === 'SUCCESS')
        return hasSuccess
      },
      {
        message: '성공 예시 이미지를 최소 1개 등록해주세요.',
      },
    ),
})
