import { ReactNode } from 'react'

interface ChallengePageProps {
  className?: string
}

const ChallengePage = ({ className }: ChallengePageProps): ReactNode => {
  return <div className={className}>ChallengePage</div>
}

export default ChallengePage
