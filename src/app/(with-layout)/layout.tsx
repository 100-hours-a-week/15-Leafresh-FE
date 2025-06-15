import { Toast } from '@shared/components'
import { AuthGuard, ModalProvider } from '@shared/config/provider'
import { GlobalWrapper } from '@shared/styles/global-wrapper'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <AuthGuard>
      <GlobalWrapper>
        {children}
        <Toast />
        <ModalProvider />
      </GlobalWrapper>
    </AuthGuard>
  )
}

export default RootLayout
