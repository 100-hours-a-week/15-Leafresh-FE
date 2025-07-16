import { PollingWatcher, TokenDeleter } from '@/features/common/components'

import { Toast } from '@/shared/components'
import { GlobalWrapper, ModalProvider } from '@/shared/config'

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
      <ModalProvider />
    </GlobalWrapper>
  )
}

export default RootLayout
