import { ENDPOINTS, fetchRequest } from '@/shared/lib'

import { LowercaseOAuthType } from '../model'

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
