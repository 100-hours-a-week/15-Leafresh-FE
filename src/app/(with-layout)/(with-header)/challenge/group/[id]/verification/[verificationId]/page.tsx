import VerificationDetails from '@features/challenge/components/challenge/participate/verification/details/VerificationDetails'

interface PageProps {
  params: Promise<{
    id: string
    verificationId: string
  }>
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params
  const { verificationId } = await params

  const challengeIdNum = Number(id)
  const verificationIdNum = Number(verificationId)

  return <VerificationDetails challengeId={challengeIdNum} verificationId={verificationIdNum} />
}

export default Page
