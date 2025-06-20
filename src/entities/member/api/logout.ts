import { LowercaseOAuthType } from '../model'

import { ENDPOINTS, fetchRequest } from '@/shared/lib'

export type LogoutResponse = null

export type LogoutVariables = {
  provider: LowercaseOAuthType
}

export const Logout = ({ provider }: LogoutVariables) => {
  return fetchRequest<LogoutResponse>(ENDPOINTS.MEMBERS.AUTH.LOGOUT(provider))
}
