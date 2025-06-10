import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

type LoginCallbackResponse = {
  isMember: boolean
  email: string
  nickname: string
  imageUrl: string
}

type LoginCallbackVariables = {
  provider: LowercaseOAuthType
  code: string
  state: string
}

export const LoginCallback = ({ provider, code, state }: LoginCallbackVariables) => {
  const query = {
    code,
    state,
  }

  return fetchRequest<LoginCallbackResponse>(ENDPOINTS.MEMBERS.AUTH.CALLBACK(provider), {
    query,
  })
}
