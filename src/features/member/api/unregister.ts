import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type UnregisterResponseType = ApiResponse<null>

/** 회원탈퇴, 토큰으로 유저 정보 판단 (인자 없음) */
export const Unregister = () => {
  return fetchRequest<UnregisterResponseType>(ENDPOINTS.MEMBERS.UNREGISTER)
}
