import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

type LoginResponse = {
  redirectUrl: string
  state: string // origin을 백엔드 JWT로 암호화한 값
}

export const Login = (provider: LowercaseOAuthType) => {
  const origin: string = window.location.origin
  return fetchRequest<LoginResponse>(ENDPOINTS.MEMBERS.AUTH.LOGIN(provider), {
    query: {
      origin,
    },
  })
}
