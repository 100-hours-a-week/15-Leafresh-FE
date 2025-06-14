import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { metaSchema } from './consts'

import { FullFormValues } from '@widgets/challenge/group/form/model/types'

export type MetaFormValues = z.infer<typeof metaSchema>

export interface MetaDataStepProps {
  form: UseFormReturn<FullFormValues>
  handleStepChange: (step: 1 | 2) => void
  isEdit: boolean
}
