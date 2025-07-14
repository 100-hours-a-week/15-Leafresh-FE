import { Suspense } from 'react'

import { LoginPage } from '@/widgets/member'

import { Loading } from '@/shared/components'

const Page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPage />
    </Suspense>
  )
}

export default Page
