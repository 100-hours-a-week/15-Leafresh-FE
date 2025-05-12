import GroupVerificationPage from '../../../../../features/challenge/components/challenge/participate/GroupVerificationPage'

export default function Page({ params }: { params: { participateId: string } }) {
  return <GroupVerificationPage participateId={params.participateId} />
}
