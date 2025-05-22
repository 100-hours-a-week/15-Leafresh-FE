import { Suspense } from 'react'

import { DetailFormValues } from '@features/challenge/components/challenge/group/create/DetailStep'
import GroupChallengeCreatePage, {
  FullFormValues,
} from '@features/challenge/components/challenge/group/create/GroupChallengeCreatePage'
import { MetaFormValues } from '@features/challenge/components/challenge/group/create/MetadataStep'
import Loading from '@shared/components/loading'

const Page = async () => {
  const defaultMetaFormValues: MetaFormValues = {
    title: '',
    category: '',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    startTime: '00:00',
    endTime: '23:50',
    maxParticipant: 0,
    examples: [
      { url: null, description: '', type: 'SUCCESS' },
      { url: null, description: '', type: 'FAILURE' },
    ],
  }
  const defaultDetailFormValues: DetailFormValues = {
    description: '',
    thumbnailUrl: '',
  }

  const defaultFormValues: FullFormValues = {
    ...defaultMetaFormValues,
    ...defaultDetailFormValues,
  }
  return (
    <Suspense fallback={<Loading />}>
      <GroupChallengeCreatePage defaultValues={defaultFormValues} isEdit={false} />
    </Suspense>
  )
}

export default Page
