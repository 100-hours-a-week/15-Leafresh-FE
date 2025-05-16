import { Suspense } from 'react'

import GroupChallengeCreatePage from '@features/challenge/components/challenge/group/create/GroupChallengeCreatePage'
import Loading from '@shared/components/loading'

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <GroupChallengeCreatePage />
    </Suspense>
  )
}

export default Page
