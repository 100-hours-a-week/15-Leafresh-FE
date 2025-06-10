import { LowercaseOAuthType } from '@entities/member/type'

import CallbackPage from './CallbackPage'

interface Props {
  params: Promise<{ provider: LowercaseOAuthType }>
}

export default async function Page({ params }: Props) {
  const { provider } = await params
  return <CallbackPage provider={provider} />
}
