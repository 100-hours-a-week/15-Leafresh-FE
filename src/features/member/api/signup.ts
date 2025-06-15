import { OAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export type SignUpResponse = {
  nickname: string
  imageUrl: string
}

export type SignUpBody = {
  email: string
  provider: {
    name: OAuthType
    id: number // OAuthUserInfoDto에서 받은 Kakao 사용자 고유 ID
  }
  nickname: string
  imageUrl: string
}

export type SignUpVariables = {
  body: SignUpBody
}

/**
 * 회원가입
 */
export const SignUp = ({ body }: SignUpVariables) => {
  return fetchRequest<SignUpResponse>(ENDPOINTS.MEMBERS.SIGNUP, {
    body,
  })
}
