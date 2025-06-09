import GroupVerificationPage from '@features/challenge/components/challenge/participate/GroupVerificationPage'

export default async function Page({ params }: { params: Promise<{ participateId: string }> }) {
  const { participateId } = await params
  return <GroupVerificationPage participateId={participateId} />
}
