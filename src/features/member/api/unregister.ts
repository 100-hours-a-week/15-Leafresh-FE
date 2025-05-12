import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

type UnregisterResponseType = ApiResponse<null>

export const Unregister = (): Promise<UnregisterResponseType> => {
  return fetchRequest<UnregisterResponseType>(ENDPOINTS.MEMBERS.UNREGISTER)
}
