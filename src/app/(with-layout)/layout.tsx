import { PollingWatcher } from '@/features/common/components'

import { Toast } from '@/shared/components'
import { AuthGuard, GlobalWrapper, ModalProvider } from '@/shared/config'

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
        <ModalProvider />
      </GlobalWrapper>
    </AuthGuard>
  )
}

export default RootLayout
