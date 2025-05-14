import { OAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

/**
 * false: 사용 가능 / true 사용 불가능
 */
type SignUpResponseType = ApiResponse<{
  isDuplicated: boolean
}>

export type SignUpBody = {
  email: string
  provider: {
    name: OAuthType
    id: number // OAuthUserInfoDto에서 받은 Kakao 사용자 고유 ID
  }
  nickname: string
  imageUrl: string
}

type SignUpVariables = {
  body: SignUpBody
}

/**
 * 회원가입
 */
export const SignUp = ({ body }: SignUpVariables) => {
  return fetchRequest<SignUpResponseType>(ENDPOINTS.MEMBERS.SIGNUP, {
    body,
  })
}
