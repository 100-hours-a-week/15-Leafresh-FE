import { OAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

// TODO : isDuplicated -> isAvailable 로 변수명 저정
/**
 * false: 사용 가능 / true 사용 불가능
 */
type SignUpResponseType = ApiResponse<{
  nickname: string
  imageUrl: string
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

/**
 * 닉네임 중복 검사 API
 */
export const SignUp = (body: SignUpBody) => {
  return fetchRequest<SignUpResponseType>(ENDPOINTS.MEMBERS.SIGNUP, {
    body,
  })
}
