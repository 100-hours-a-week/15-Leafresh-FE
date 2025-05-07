import { EndpointType } from '@shared/constants/endpoint/endpoint'

const BASE_URL = 'http://34.47.72.161:8080'

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

export async function fetchRequest<T>(endpoint: EndpointType, options: OptionsType = {}): Promise<T> {
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
    const error: ErrorResponse = {
      status: response.status,
      message: typeof data === 'object' && data?.message ? data.message : 'Unknown error',
      data: null,
    }
    throw error
  }

  return data as T
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
