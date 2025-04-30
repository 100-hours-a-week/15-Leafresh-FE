const BASE_URL = 'http://localhost:8080'; // TODO: 추후 env 처리

//공통 응답 타입
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponse extends ApiResponse<null> {}

//fetch error 타입
export interface FetchError<E = unknown> extends Error {
  response: Response;
  data: E;
}

// API 엔트리를 정규화하는 유틸 타입
type ApiDescriptor = {
  method: string;
  path: string;
};

// 객체 or 함수형 API 모두 함수로 정규화
type NormalizedApi<T> =
  T extends (...args: any[]) => infer R ? (...args: Parameters<T>) => ApiDescriptor :
  T extends ApiDescriptor ? () => ApiDescriptor :
  never;

// 재귀적으로 API 전체를 평탄화
type FlattenApi<T> = {
  [K in keyof T]: T[K] extends ApiDescriptor | ((...args: any[]) => ApiDescriptor)
    ? NormalizedApi<T[K]>
    : FlattenApi<T[K]>
};

// 전체 API 타입
import { API } from '@app/shared/constants/api';
export type FlatApiMap = FlattenApi<typeof API>;

export const fetcher = {
  request: async <TResponse>(
    apiEntry: () => { method: string; path: string },
    options: {
      body?: unknown;
      headers?: HeadersInit;
      query?: Record<string, string | number>;
    } = {}
  ): Promise<TResponse> => {
    const { method, path } = apiEntry();

  // query string 구성
  const url = new URL(BASE_URL + path);
  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) =>
      url.searchParams.append(key, String(value))
    );
  }

  //body가 Form의 형태인지 확인 boolean
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  //fetch api 호출
  const response = await fetch(url.toString(), {
    method,
    headers,
    credentials: 'include', //항상 쿠키 포함
    body: isFormData
      ? options.body as BodyInit
      : options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  //response body type 검사
  const contentType = response.headers.get('Content-Type');
  const data = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {//만약 에러가가 json으로 안와도 반환
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();
  
    // 에러를 ApiResponse<null> 형태로 직접 throw
    const error: ErrorResponse = {
      status: response.status,
      message: typeof data === 'object' && data?.message ? data.message : 'Unknown error',
      data: null,
    };
    throw error;
  }
  /*
  에러 핸들링 예시, 그러나 이렇게 하면 백엔드 서버에서 정한 status만 return됨
  try {
    await fetcher.request<ApiResponse<User>>(API.members.detail);
  } catch (error) {
    const err = error as ErrorResponse;
    console.log(err.status);  // 403
    console.log(err.message); // "회원 정보 수정 권한이 없습니다."
    console.log(err.data);    // null
  }
  */
  return data as TResponse;
  },
};

/* api 호출 예시
// 1. 객체형 API 사용
await fetcher.request<ApiResponse<Event[]>>(
  API.challenges.events
);

// 2. 함수형 API 사용
await fetcher.request<ApiResponse<Detail>>(
  API.challenges.Detail(123)
);

// 3. 쿼리스트링 + body 사용
await fetcher.request<ApiResponse<Search[]>>(
  API.store.products,
  {
    query: { keyword: '텀블러' },
    body: { page: 1, size: 10 },
  }
);
*/