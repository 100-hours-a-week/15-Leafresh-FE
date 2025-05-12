import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type LogoutResponseType = ApiResponse<null>

export const Logout = (provider: LowercaseOAuthType): Promise<LogoutResponseType> => {
  return fetchRequest<LogoutResponseType>(ENDPOINTS.MEMBERS.AUTH.LOGOUT(provider))
}
