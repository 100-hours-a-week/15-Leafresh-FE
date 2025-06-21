import { CallbackPage } from '@/widgets/member'

import { LowercaseOAuthType } from '@/entities/member/model'

interface Props {
  params: Promise<{ provider: LowercaseOAuthType }>
}

export default async function Page({ params }: Props) {
  const { provider } = await params
  return <CallbackPage provider={provider} />
}
