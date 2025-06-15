import { Toast } from '@shared/components'
import { AuthGuard, ModalProvider } from '@shared/config/provider'
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
