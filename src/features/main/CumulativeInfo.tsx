import { ReactNode } from 'react'

interface CumulativeInfoProps {
  className?: string
}

const CumulativeInfo = ({ className }: CumulativeInfoProps): ReactNode => {
  return <div className={className}>To be continued</div>
}

export default CumulativeInfo
