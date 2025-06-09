import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api'

type LoginCallbackResponse = {
  isMember: boolean
  email: string
  nickname: string
  imageUrl: string
}

type LoginCallbackQuery = {
  code: string
}

export const LoginCallback = (provider: LowercaseOAuthType, query: LoginCallbackQuery) => {
  return fetchRequest<LoginCallbackResponse>(ENDPOINTS.MEMBERS.AUTH.CALLBACK(provider), {
    query,
  })
}
