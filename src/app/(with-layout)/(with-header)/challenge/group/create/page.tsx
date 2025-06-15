import { Suspense } from 'react'

import { DetailFormValues } from '@features/challenge/components/form-detail-step/model/types'
import { MetaFormValues } from '@features/challenge/components/form-metadata-step/model/types'
import { Loading } from '@shared/components'

import { ChallengeGroupFormPage } from '@widgets/challenge'
import { FullFormValues } from '@widgets/challenge/group/form/model/types'

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
      <ChallengeGroupFormPage defaultValues={defaultFormValues} isEdit={false} />
    </Suspense>
  )
}

export default Page
