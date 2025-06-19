import { LowercaseOAuthType } from '@entities/member/model/type'

import CallbackPage from '../../../../../../widgets/member/oauth-callback/ui/callback'

interface Props {
  params: Promise<{ provider: LowercaseOAuthType }>
}

export default async function Page({ params }: Props) {
  const { provider } = await params
  return <CallbackPage provider={provider} />
}
