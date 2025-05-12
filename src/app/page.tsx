import { ReactNode } from 'react'

import Header from '@shared/components/header'
import Footer from '@shared/components/footer'
import HomePage from '@features/main/HomePage'
import { HydrationBoundary } from '@tanstack/react-query'

interface MainPageProps {
  className?: string
}

const HEADER_HEIGHT = 60
const WIDTH_PADDING = 35

const MainPage = ({ className }: MainPageProps): ReactNode => {
  return (
    <HydrationBoundary>
      <>
        <Header height={HEADER_HEIGHT} padding={WIDTH_PADDING} />
        <main>
          <HomePage />
        </main>
        <Footer padding={WIDTH_PADDING} />
      </>
    </HydrationBoundary>
  )
}

export default MainPage
