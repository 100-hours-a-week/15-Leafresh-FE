import { ReactNode } from 'react'

interface MainPageProps {
  className?: string
}

const MainPage = ({ className }: MainPageProps): ReactNode => {
  return <div className={className}>MainPage</div>
}

export default MainPage
