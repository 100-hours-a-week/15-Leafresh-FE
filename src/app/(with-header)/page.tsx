import { ReactNode } from 'react'

import HomePage from '@features/main/HomePage'

interface MainPageProps {
  className?: string
}

const HEADER_HEIGHT = 60
const WIDTH_PADDING = 35

const MainPage = ({ className }: MainPageProps): ReactNode => {
  return <HomePage />
}

export default MainPage
