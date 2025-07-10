import { ChallengeModalProvider, PollingWatcher } from '@/features/challenge/config'
import { GlobalWrapper } from '@/features/common/components'

import { Toast } from '@/shared/components'
import { AuthGuard, CommonModalProvider } from '@/shared/config'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <AuthGuard>
      <GlobalWrapper>
        <PollingWatcher /> {/* 롱폴링 상태 조회  */}
        {children}
        <Toast />
        <CommonModalProvider />
        <ChallengeModalProvider />
      </GlobalWrapper>
    </AuthGuard>
  )
}

export default RootLayout
