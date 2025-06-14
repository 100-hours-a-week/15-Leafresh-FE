export interface ChallengeProps {
  className?: string
  imageUrl?: string
  title: string
  startDate: Date
  endDate: Date
  successCount: number
  maxCount: number
  onClick?: () => void
}
