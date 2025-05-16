import { Suspense } from 'react'

import GroupChallengeCreatePage from './ChallengeCreatepage'
const Page = async () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <GroupChallengeCreatePage />
    </Suspense>
  )
}

export default Page
