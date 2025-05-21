import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { fetchRequest } from '@shared/lib/api/fetcher/fetcher'

export type UnregisterResponse = null

/** 회원탈퇴, 토큰으로 유저 정보 판단 (인자 없음) */
export const Unregister = () => {
  return fetchRequest<UnregisterResponse>(ENDPOINTS.MEMBERS.UNREGISTER)
}
