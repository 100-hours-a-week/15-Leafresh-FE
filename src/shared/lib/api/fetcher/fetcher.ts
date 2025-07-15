import { isServer } from '@tanstack/react-query'

import { clientFetchRequest } from '../client-fetcher'
import { serverFetchRequest } from '../server-fetcher'
import { ApiResponse, Endpoint, OptionsType } from '../type'

export const fetchRequest = async <T>(endpoint: Endpoint, options: OptionsType = {}): Promise<ApiResponse<T>> => {
  // 서버 환경
  if (isServer) {
    console.log('this is server request! , endpoint: ', endpoint)

    // 서버 액션 fetch 호출 (쿠키 수동 포함)
    return serverFetchRequest<T>(endpoint, options)
  }
  return clientFetchRequest<T>(endpoint, options)
}
