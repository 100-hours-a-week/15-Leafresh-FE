import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type LogoutResponse = ApiResponse<null>

export type LogoutVariables = {
  provider: LowercaseOAuthType
}

export const Logout = ({ provider }: LogoutVariables): Promise<LogoutResponse> => {
  return fetchRequest<LogoutResponse>(ENDPOINTS.MEMBERS.AUTH.LOGOUT(provider))
}
