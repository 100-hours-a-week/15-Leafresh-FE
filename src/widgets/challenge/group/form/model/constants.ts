import { detailSchema } from '@features/challenge/components/challenge/group/create/DetailStep'
import { metaSchema } from '@features/challenge/components/challenge/group/create/MetadataStep'

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
