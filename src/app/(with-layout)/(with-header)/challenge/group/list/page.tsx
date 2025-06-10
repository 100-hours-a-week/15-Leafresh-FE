import { Suspense } from 'react'
import { ChallengeGroupListPage } from '@widgets/challenge'

import Loading from '@shared/components/loading'

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <ChallengeGroupListPage />
    </Suspense>
  )
}

export default Page
