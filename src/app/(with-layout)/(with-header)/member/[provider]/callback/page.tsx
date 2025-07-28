import { Suspense } from 'react'

import { CallbackPage } from '@/widgets/member'

import { LowercaseOAuthType } from '@/entities/member/model'

import { Loading } from '@/shared/components'

interface Props {
  params: Promise<{ provider: LowercaseOAuthType }>
}

export default async function Page({ params }: Props) {
  const { provider } = await params
  return (
    <Suspense fallback={<Loading />}>
      <CallbackPage provider={provider} />
    </Suspense>
  )
}
