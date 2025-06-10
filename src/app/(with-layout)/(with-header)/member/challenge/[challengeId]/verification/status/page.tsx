import { ChallengeGroupVerificationStatusPage } from '@widgets/challenge'

interface PageProps {
  params: Promise<{ participateId: string }>
}

export default async function Page({ params }: PageProps) {
  const { participateId } = await params
  return <ChallengeGroupVerificationStatusPage participateId={participateId} />
}
