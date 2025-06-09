import { Suspense } from 'react'

import ChallengeListPage from '@features/challenge/components/challenge/group/list/ChallengeListPage'
import Loading from '@shared/components/loading'

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <ChallengeListPage />
    </Suspense>
  )
}

export default Page
