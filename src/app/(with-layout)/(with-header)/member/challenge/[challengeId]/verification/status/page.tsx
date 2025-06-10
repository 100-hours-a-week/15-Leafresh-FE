import { MemberChallengeVerificationStatusPage } from '@widgets/member'

interface PageProps {
  params: Promise<{ participateId: string }>
}

export default async function Page({ params }: PageProps) {
  const { participateId } = await params
  return <MemberChallengeVerificationStatusPage participateId={participateId} />
}
