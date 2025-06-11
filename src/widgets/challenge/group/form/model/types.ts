import { z } from 'zod'

import { fullSchema } from './constants'

export interface ChallengeGroupFormPageProps {
  defaultValues: FullFormValues
  isEdit?: boolean
  challengeId?: number
}

export type FullFormValues = z.infer<typeof fullSchema>
