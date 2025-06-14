import { ChallengeVerificationStatusType } from '@entities/challenge/model'

export interface VerificationImageInputProps {
  label: string
  status: ChallengeVerificationStatusType
  imageUrl: string | null
  description: string | null
  cameraTitle: string
  onChange: (data: { imageUrl: string | null; description?: string | null }) => void
  onZoom: () => void
  readOnly?: boolean
  className?: string
}
