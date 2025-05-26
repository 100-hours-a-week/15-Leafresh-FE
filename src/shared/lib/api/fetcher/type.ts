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

export type OptionsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  headers?: HeadersInit
  query?: Record<string, string | number>
}
