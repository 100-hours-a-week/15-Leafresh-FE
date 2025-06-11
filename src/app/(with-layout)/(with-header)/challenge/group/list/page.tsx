import { Suspense } from 'react'

import Loading from '@shared/components/loading'

import { ChallengeGroupListPage } from '@widgets/challenge'

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <ChallengeGroupListPage />
    </Suspense>
  )
}

export default Page
