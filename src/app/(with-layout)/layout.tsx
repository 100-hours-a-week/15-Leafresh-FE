import PollingWatcher from '@features/common/components/polling-watcher/ui/polling-watcher'
import Toast from '@shared/components/toast/ui/toast'
import AuthGuard from '@shared/config/providers/auth-gaurd'
import ModalProvider from '@shared/config/providers/modal-provider'
import LayoutWrapper from '@shared/styles/global-wrapper'

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
