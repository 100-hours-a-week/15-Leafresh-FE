import { useOAuthUserStore } from '@entities/member/context/OAuthUserStore'
import { useUserStore } from '@entities/member/context/UserStore'
import { ENDPOINTS, EndpointType } from '@shared/constants/endpoint/endpoint'

const BASE_URL = 'https://leafresh.app'

export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface ErrorResponse extends ApiResponse<null> {}

export interface FetchError<E = unknown> extends Error {
  response: Response
  data: E
}

type OptionsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  headers?: HeadersInit
  query?: Record<string, string | number>
}

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

async function refreshAccessToken(): Promise<void> {
  if (isRefreshing) return refreshPromise ?? Promise.resolve()

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.MEMBERS.AUTH.RE_ISSUE}`, {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      isRefreshing = false
    } catch (error) {
      // 로그인 정보 초기화
      useOAuthUserStore.getState().clearOAuthUserInfo()
      useUserStore.getState().clearUserInfo()

      isRefreshing = false
      throw error
    }
  })()

  return refreshPromise
}

export async function fetchRequest<T>(
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

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
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
        await refreshAccessToken()
        return fetchRequest<T>(endpoint, options, true) // 딱 한 번만 재시도
      } catch (refreshError) {
        const error: ErrorResponse = {
          status: 401,
          message: '세션이 만료되었습니다. 다시 로그인해주세요.',
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

/** 사용 예시
1. API 정의
import { API } from '@/shared/constants/endpoint'
import { fetchRequest } from '@/shared/lib/fetchRequest'

type CreatePostDTO = {
  title: string
  content: string
}

type CreatePostResponse = ApiResponse<{
  id: number
  createdAt: string
}>

export const createPost = (body: CreatePostDTO): Promise<CreatePostResponse> => {
  return fetchRequest(API.POSTS.CREATE, { body })
}

2. Tanstack-query 활용
const { mutate, isPending, isError, error } = useMutation({
  mutationFn: createPost,
  onSuccess: (data) => {
    console.log('생성 성공:', data.data.id)
  },
})

 */
