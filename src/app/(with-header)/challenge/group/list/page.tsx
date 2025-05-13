import { Suspense } from 'react'

import Loading from '@shared/components/loading'

import ChallengeListPage from '../../../../../features/challenge/components/challenge/group/list/ChallengeListPage'

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <ChallengeListPage />
    </Suspense>
  )
}

export default Page
