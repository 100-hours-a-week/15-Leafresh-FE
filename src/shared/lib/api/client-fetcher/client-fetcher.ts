import { BASE_API_URL } from '@shared/constants/api-url'
import { EndpointType } from '@shared/constants/endpoint/endpoint'

import { ApiResponse, ErrorResponse, OptionsType } from '../type'
import { refreshClientAccessToken } from './client-reissue'

const BASE_URL = BASE_API_URL

export async function clientFetchRequest<T>(
  endpoint: EndpointType,
  options: OptionsType = {},
  isRetry = false,
): Promise<ApiResponse<T>> {
  /** Request */
  const { method, path } = endpoint
  const url = new URL(BASE_URL + path)

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => url.searchParams.append(key, String(value)))
  }

  const isFormData: boolean = options.body instanceof FormData
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers ?? {}),
  }

  let body = undefined
  if (isFormData) {
    body = options.body as BodyInit
  } else if (options.body) {
    body = JSON.stringify(options.body)
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body,
    credentials: 'include',
  })

  /** Response */
  const contentType = response.headers.get('Content-Type')
  const data = contentType?.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    // ✅ Access Token 만료 추정 시 재시도
    if ((response.status === 401 || response.status === 403) && !isRetry) {
      try {
        console.log('🥲 재발급 시작')

        await refreshClientAccessToken()

        return clientFetchRequest<T>(endpoint, options, true) // 딱 한 번만 재시도
      } catch (refreshError) {
        console.log('✅ 리프레시에서 오류 발생')

        const error: ErrorResponse = {
          status: 401,
          message: '세션이 만료되었습니다. 다시 로그인해주세요',
          data: null,
        }
        /** 미인증 유저에게는 토스트로 알림 */
        // handleAuthError(error)
        throw error
      }
    }

    const error: ErrorResponse = {
      status: response.status,
      message: typeof data === 'object' && data?.message ? data.message : 'Unknown error',
      data: null,
    }
    throw error
  }

  return data as ApiResponse<T>
}
