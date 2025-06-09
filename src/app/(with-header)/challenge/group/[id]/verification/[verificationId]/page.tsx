import VerificationDetails from '@features/challenge/components/challenge/participate/verification/details/VerificationDetails'
import { ReactNode } from 'react'

interface PageProps {
  className?: string
  params: {
    id: string
    verificationId: string
  }
}

const Page = async ({ className, params }: PageProps): Promise<ReactNode> => {
  const challengeId = Number(params.id)
  const verificationId = Number(params.verificationId)
  return <VerificationDetails challengeId={challengeId} verificationId={verificationId} />
}

export default Page
