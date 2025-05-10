import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type LoginResponseType = ApiResponse<{
  redirectUrl: string
}>

export const Login = (provider: LowercaseOAuthType) => {
  return fetchRequest<LoginResponseType>(ENDPOINTS.MEMBERS.AUTH.LOGIN(provider))
}
