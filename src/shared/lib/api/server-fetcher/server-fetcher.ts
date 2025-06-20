'use server'

import { cookies } from 'next/headers'

import { BASE_API_URL, EndpointType } from '../consts'
import { ApiResponse, ErrorResponse, OptionsType } from '../type'
import { refreshServerAccessToken } from './server-reissue'

const BASE_URL = BASE_API_URL

export async function serverFetchRequest<T>(
  endpoint: EndpointType,
  options: OptionsType = {},
  isRetry = false,
): Promise<ApiResponse<T>> {
  const { method, path } = endpoint
  const url = new URL(
    BASE_URL + path,
    process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'https://local.dev-leafresh.app',
  )

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => url.searchParams.append(key, String(value)))
  }

  const isFormData = options.body instanceof FormData
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

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')

  const response = await fetch(url.toString(), {
    method,
    headers: {
      ...headers,
      Cookie: cookieHeader,
    },
    body,
  })

  const contentType = response.headers.get('Content-Type')
  const data = contentType?.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && !isRetry) {
      try {
        await refreshServerAccessToken()
        return serverFetchRequest<T>(endpoint, options, true)
      } catch (refreshError) {
        const error: ErrorResponse = {
          status: 401,
          message: '세션이 만료되었습니다. 다시 로그인해주세요',
          data: null,
        }
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
