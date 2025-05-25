'use server'

import { cookies } from 'next/headers'

import { isServer } from '@tanstack/react-query'

import { EndpointType } from '@shared/constants/endpoint/endpoint'

import { fetchRequest } from './fetcher'
import { ApiResponse, OptionsType } from './type'

/** SSR 환경에서 쿠키 포함 요청 */
export async function serverFetchRequest<T>(
  endpoint: EndpointType,
  options: OptionsType = {},
): Promise<ApiResponse<T>> {
  if (!isServer) {
    throw new Error(
      '[serverFetchRequest] 이 함수는 서버 환경에서만 호출되어야 합니다. 클라이언트에서 호출이 감지되었습니다.',
    )
  }
  const cookieStore = await cookies()
  const ServerSideCookies = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')

  console.log('✅ Server Component Cookies')
  console.log(ServerSideCookies)

  return fetchRequest<T>(endpoint, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Cookie: ServerSideCookies,
    },
  })
}
