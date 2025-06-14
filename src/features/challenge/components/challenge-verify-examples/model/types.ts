import { ChallengeVerificationResultType } from '@entities/challenge/model'

export interface VerificationImageData {
  id?: number
  url: string | null
  description: string
  type: ChallengeVerificationResultType
}

export interface ChallengeVerifyExamplesProps {
  title: string
  description: string
  maxCount: number
  examples: VerificationImageData[]
  onChange: (updated: VerificationImageData[]) => void
  readOnly?: boolean
  required?: boolean
  className?: string
  verificationInputClassName?: string
}
