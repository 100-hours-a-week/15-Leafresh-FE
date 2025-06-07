import { isServer } from '@tanstack/react-query'

import { EndpointType } from '@shared/constants/endpoint/endpoint'

import { ApiResponse, OptionsType } from '../client-fetcher/type'
import { serverFetchRequest } from '../server-fetcher'

export const fetchRequest = async <T>(endpoint: EndpointType, options: OptionsType = {}): Promise<ApiResponse<T>> => {
  if (isServer) {
    // 서버 환경에서는 서버 액션 fetch 호출
    return serverFetchRequest<T>(endpoint, options)
  }
}
