import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type PostGroupVerificationBody = {
  imageUrl: string
  content: string | undefined
}

export type PostGroupVerificationResponse = {
  verificationId: number
  createdAt: string
}

type PostGroupVerificationVariables = {
  challengeId: number
  body: PostGroupVerificationBody
}

/** 단체 챌린지 인증 제출 */
export const PostGroupVerification = ({ challengeId, body }: PostGroupVerificationVariables) =>
  fetchRequest<PostGroupVerificationResponse>(ENDPOINTS.CHALLENGE.GROUP.VERIFICATION.SUBMIT(challengeId), { body })
