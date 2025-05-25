import { Suspense } from 'react'

import Loading from '@shared/components/loading'

import GroupChallengeCreatePage from './GroupChallengeCreatePage'

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <GroupChallengeCreatePage />
    </Suspense>
  )
}

export default Page
