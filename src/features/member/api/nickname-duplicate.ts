import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { ApiResponse, fetchRequest } from '@shared/lib/api/fetcher/fetcher'

// TODO : isDuplicated -> isAvailable 로 변수명 저정
/**
 * false: 사용 가능 / true 사용 불가능
 */
type NicknameDuplicateResponseType = ApiResponse<{
  isDuplicated: boolean
}>

type NicknameDuplicateQuery = {
  input: string
}

/**
 * 닉네임 중복 검사 API
 */
export const NicknameDuplicate = (query: NicknameDuplicateQuery) => {
  return fetchRequest<NicknameDuplicateResponseType>(ENDPOINTS.MEMBERS.DUPLICATE_NICKNAME, {
    query,
  })
}
