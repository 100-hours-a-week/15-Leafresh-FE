import { ReactNode } from 'react'

interface IntroduceProps {
  className?: string
}

export const Introduce = ({ className }: IntroduceProps): ReactNode => {
  return <div className={className}>Introduce</div>
}
