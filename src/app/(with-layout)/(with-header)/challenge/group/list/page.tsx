import { Suspense } from 'react'
import { GroupChallengeListPage } from '@widgets/challenge'

import Loading from '@shared/components/loading'

const Page = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <GroupChallengeListPage />
    </Suspense>
  )
}

export default Page
