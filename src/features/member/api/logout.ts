import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type LogoutResponseType = ApiResponse<null>

export type LogoutVariables = {
  provider: LowercaseOAuthType
}

export const Logout = ({ provider }: LogoutVariables): Promise<LogoutResponseType> => {
  return fetchRequest<LogoutResponseType>(ENDPOINTS.MEMBERS.AUTH.LOGOUT(provider))
}
