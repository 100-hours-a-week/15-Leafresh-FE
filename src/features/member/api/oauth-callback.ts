import { LowercaseOAuthType } from '@entities/member/type'
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type LoginCallbackResponseType = ApiResponse<{
  isMember: boolean
  email: string
  nickname: string
  imageUrl: string
}>

export const LoginCallback = (
  provider: LowercaseOAuthType,
  query: Record<string, string>,
): Promise<LoginCallbackResponseType> => {
  return fetchRequest<LoginCallbackResponseType>(ENDPOINTS.MEMBERS.AUTH.CALLBACK(provider), {
    query,
  })
}
