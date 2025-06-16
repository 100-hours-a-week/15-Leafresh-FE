import { isServer } from '@tanstack/react-query'

import { EndpointType } from '@shared/constants/endpoint/endpoint'

import { clientFetchRequest } from '../client-fetcher'
import { serverFetchRequest } from '../server-fetcher'
import { ApiResponse, OptionsType } from '../type'

export const fetchRequest = async <T>(endpoint: EndpointType, options: OptionsType = {}): Promise<ApiResponse<T>> => {
  // 서버 환경
  if (isServer) {
    // 서버 액션 fetch 호출 (쿠키 수동 포함)
    console.log('🧪 서버 요청임')

    return serverFetchRequest<T>(endpoint, options)
  }
  return clientFetchRequest<T>(endpoint, options)
}
