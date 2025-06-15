import { z } from 'zod'

import { WarningType } from '../ui/form-detail-step'

export const detailSchema = z.object({
  description: z.string().min(1, '챌린지 설명을 입력해주세요'),
  thumbnailUrl: z.string().min(1, '썸네일 이미지를 등록해주세요'),
})

export const CHALLENGE_DETAILS_WARNINGS: WarningType[] = [
  {
    isWarning: false,
    value: '참여 인원이 존재하면, 수정 및 삭제는 불가합니다.',
  },
  {
    isWarning: false,
    value: '참여 나뭇잎 보상은 직접 수정할 수 없습니다.',
  },
  {
    isWarning: false,
    value: '인증 여부는 생성자가 아닌, AI가 판단합니다.',
  },
  {
    isWarning: false,
    value: '생성된 챌린지는 모든 사용자에게 공개됩니다.',
  },
  {
    isWarning: true,
    value: '부적절한 챌린지는 관리자에 의해 삭제될 수 있습니다.',
  },
]
