import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type LoginResponse = {
  redirectUrl: string
}

export const Login = (provider: LowercaseOAuthType) => {
  return fetchRequest<LoginResponse>(ENDPOINTS.MEMBERS.AUTH.LOGIN(provider))
}
