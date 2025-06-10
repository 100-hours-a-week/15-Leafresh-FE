import { isServer } from '@tanstack/react-query'

import { EndpointType } from '@shared/constants/endpoint/endpoint'

import { clientFetchRequest } from '../client-fetcher'
import { serverFetchRequest } from '../server-fetcher'
import { ApiResponse, OptionsType } from '../type'

export const BASE_URL = 'https://be.dev-leafresh.app'

export const fetchRequest = async <T>(endpoint: EndpointType, options: OptionsType = {}): Promise<ApiResponse<T>> => {
  // 서버 환경
  if (isServer) {
    // 서버 액션 fetch 호출 (쿠키 수동 포함)
    return serverFetchRequest<T>(endpoint, options)
  }
  return clientFetchRequest<T>(endpoint, options)
}
