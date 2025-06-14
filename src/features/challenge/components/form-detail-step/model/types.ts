import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { detailSchema } from './consts'

import { FullFormValues } from '@widgets/challenge/group/form/model/types'

export type DetailFormValues = z.infer<typeof detailSchema>

export interface DetailsStepProps {
  form: UseFormReturn<FullFormValues>
  handleStepChange: (step: 1 | 2) => void
  onSubmit: () => void
  isCreating: boolean

  isEdit: boolean
}

export type WarningType = {
  isWarning: boolean
  value: string
}
