import { Suspense } from 'react'

import { GroupChallengeFormPage } from '@/widgets/challenge'

import { DetailFormValues, FullFormValues, MetaFormValues } from '@/entities/challenge/model'

import { Loading } from '@/shared/components'
import { DateToKst } from '@/shared/lib'

const Page = async () => {
  const defaultMetaFormValues: MetaFormValues = {
    title: '',
    category: '',
    startDate: DateToKst(new Date()),
    endDate: DateToKst(new Date(Date.now() + 24 * 60 * 60 * 1000)),
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
      <GroupChallengeFormPage defaultValues={defaultFormValues} isEdit={false} />
    </Suspense>
  )
}

export default Page
