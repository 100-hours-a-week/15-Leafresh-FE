import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type LogoutResponse = null

export type LogoutVariables = {
  provider: LowercaseOAuthType
}

export const Logout = ({ provider }: LogoutVariables) => {
  return fetchRequest<LogoutResponse>(ENDPOINTS.MEMBERS.AUTH.LOGOUT(provider))
}
