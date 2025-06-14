import { Verification } from '@entities/challenge/api'

export interface VerificationCardProps {
  challengeId: number
  verificationData: Verification
  className?: string
}
