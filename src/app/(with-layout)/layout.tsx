import { Toast } from '@shared/components'
import AuthGuard from '@shared/config/providers/AuthGaurd'
import ModalProvider from '@shared/config/providers/ModalProvider'
import LayoutWrapper from '@shared/styles/LayoutWrapper'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <AuthGuard>
      <LayoutWrapper>
        {children}
        <Toast />
        <ModalProvider />
      </LayoutWrapper>
    </AuthGuard>
  )
}

export default RootLayout
