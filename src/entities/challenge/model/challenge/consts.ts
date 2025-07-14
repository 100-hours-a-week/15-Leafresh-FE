import { z } from 'zod'

/** 카테고리 */
export const CHALLENGE_CATEGORY_PAIRS = [
  { kor: '제로웨이스트', eng: 'ZERO_WASTE' },
  { kor: '플로깅', eng: 'PLOGGING' },
  { kor: '탄소 발자국', eng: 'CARBON_FOOTPRINT' },
  { kor: '에너지 절약', eng: 'ENERGY_SAVING' },
  { kor: '업사이클', eng: 'UPCYCLING' },
  { kor: '문화 공유', eng: 'MEDIA' },
  { kor: '디지털 탄소', eng: 'DIGITAL_CARBON' },
  { kor: '비건', eng: 'VEGAN' },
  { kor: '기타', eng: 'ETC' },
] as const

export const CHALLENGE_CATEGORIES = CHALLENGE_CATEGORY_PAIRS.map(pair => pair.eng)
export const CHALLENGE_CATEGORIES_KOR = CHALLENGE_CATEGORY_PAIRS.map(pair => pair.kor)

/** 최대 인원 */
// 최대, 최소, 가능한 간격
export const PARTICIPANT_RANGE = {
  MIN: 10,
  MAX: 100,
  RANGE: 10,
}

/** 피드 인증 여부 */
export const FEED_VERIFICATION_STAUS = [
  'SUCCESS', // 성공
  'FAILURE', // 실패
  'PENDING_APPROVE', // 인증 중
] as const

/** 챌린지 스키마 */
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

export const detailSchema = z.object({
  description: z.string().min(1, '챌린지 설명을 입력해주세요'),
  thumbnailUrl: z.string().min(1, '썸네일 이미지를 등록해주세요'),
})

export const fullSchema = metaSchema
  .merge(detailSchema)
  .refine(
    ({ startDate, endDate }) => {
      const start = startDate.setHours(0, 0, 0, 0)
      const end = endDate.setHours(0, 0, 0, 0)
      const msDiff = end - start
      return msDiff > 0
    },
    {
      path: ['endDate'],
      message: '하루 지속되는 챌린지는 불가능합니다.',
    },
  )
  .refine(
    data => {
      const msPerDay = 24 * 60 * 60 * 1000
      const start = data.startDate.setHours(0, 0, 0, 0)
      const end = data.endDate.setHours(0, 0, 0, 0)
      const diffDays = (end - start) / msPerDay
      return diffDays >= 1
    },
    {
      path: ['endDate'],
      message: '종료일은 시작일보다 정확히 하루 뒤여야 합니다.',
    },
  )
