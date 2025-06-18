import Toast from '@shared/components/toast/ui/toast'
import AuthGuard from '@shared/config/providers/AuthGaurd'
import ModalProvider from '@shared/config/providers/ModalProvider'
import PollingWatcher from '@shared/config/providers/PollingWatcher'
import LayoutWrapper from '@shared/styles/LayoutWrapper'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <AuthGuard>
      <LayoutWrapper>
        <PollingWatcher /> {/* 롱폴링 상태 조회  */}
        {children}
        <Toast />
        <ModalProvider />
      </LayoutWrapper>
    </AuthGuard>
  )
}

export default RootLayout
