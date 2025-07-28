import { ChallengeModalProvider, PollingWatcher } from '@/features/challenge/config'
import { GlobalWrapper, TokenDeleter } from '@/features/common/components'

import { Toast } from '@/shared/components'
import { CommonModalProvider } from '@/shared/config'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <GlobalWrapper>
      <PollingWatcher /> {/* 롱폴링 상태 조회  */}
      <TokenDeleter />
      {children}
      <Toast />
      <CommonModalProvider />
      <ChallengeModalProvider />
    </GlobalWrapper>
  )
}

export default RootLayout
