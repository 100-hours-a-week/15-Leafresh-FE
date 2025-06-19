import { LowercaseOAuthType } from '@entities/member/model/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

export type LogoutResponse = null

export type LogoutVariables = {
  provider: LowercaseOAuthType
}

export const Logout = ({ provider }: LogoutVariables) => {
  return fetchRequest<LogoutResponse>(ENDPOINTS.MEMBERS.AUTH.LOGOUT(provider))
}
