import { VerificationStatus } from '../../verification-status-card/model/types'

export interface Verification {
  day: number
  imageUrl: string
  status: VerificationStatus
}

export interface VerificationCarouselProps {
  verifications: Verification[]
}
