const BASE_URL = 'http://localhost:8080'; // TODO: 추후 env 처리

// ✅ 공통 응답 타입
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

type ErrorResponse = ApiResponse<null>;

// ✅ fetch error 타입
export interface FetchError<E = unknown> extends Error {
  response: Response;
  data: E;
}

// 1) RequestInit에서 'body'만 빼고, body를 unknown으로 다시 정의
type CustomRequestInit = Omit<RequestInit, 'body'> & { body?: unknown };

export async function customFetch<T, E = unknown>(
  input: RequestInfo,
  init: CustomRequestInit = {}
): Promise<T> {
  const { body, headers, ...rest } = init;

  const isFormData = body instanceof FormData;//FormData인지 확인

  //FormData가 아니라면 Header 요소 추가
  const defaultHeaders: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

    // JSON이 아닌 경우 FormData로, 아니면 JSON.stringify
    let parsedBody: BodyInit | undefined;
    if (isFormData) {
      parsedBody = body;
    } else if (body != null && typeof body === 'object') {
      parsedBody = JSON.stringify(body);
    }

  //자동으로 서버 url 추가
  let url = typeof input === 'string' && input.startsWith('/')
    ? BASE_URL + input
    : input;

  //fetch api
  const response = await fetch(url, {
    credentials: 'include',
    ...rest,
    headers: defaultHeaders,
    body: parsedBody,
  });

  const contentType = response.headers.get('Content-Type');

  //response body가 json인지 확인하고 json으로 변환
  let responseData: unknown;
  
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  //오류 났을 때
  if (!response.ok) {
    //실패한 경우에도 응답 body를 포함해서 에러 던짐
    const error: FetchError<E> = Object.assign(new Error(`HTTP error! status: ${response.status}`), {
      response,
      data: responseData as E,
    });
    throw error;
  }
  /*
  에러 핸들링 예시
  try {
    await fetcher.get<Challenge[], ErrorResponse>('/api/challenges');
  } catch (error) {
    const err = error as FetchError<ErrorResponse>;
    console.error(err.data.message); // "회원 정보 수정 권한이 없습니다."
    console.error(err.data.status);  // 403
  }
  */

  // response 항상 반환
  return responseData as T;
}

//http 메서드 별 사용
export const fetcher = {
  //GET 예시: const response = await fetcher.get<Challenge[]>('/api/challenges');
  get: <T, E = ErrorResponse>(url: string) =>
    customFetch<ApiResponse<T>, E>(url, { method: 'GET' }),

  //POST 예시: const response = await fetcher.post<Challenge>('/api/challenges', body);
  post: <T, E = ErrorResponse>(url: string, body?: unknown) =>
    customFetch<ApiResponse<T>, E>(url, { method: 'POST', body }),

  //PATCH 예시: const response = await fetcher.patch<Challenge>('/api/challenges', body);
  patch: <T, E = ErrorResponse>(url: string, body?: unknown) =>
    customFetch<ApiResponse<T>, E>(url, { method: 'PATCH', body }),

  //PUT 예시: const response = await fetcher.put<Challenge>('/api/challenges', body);
  put: <T, E = ErrorResponse>(url: string, body?: unknown) =>
    customFetch<ApiResponse<T>, E>(url, { method: 'PUT', body }),

  //DELETE 예시: const response = await fetcher.delete<null>('/api/challenges/42');
  delete: <T, E = ErrorResponse>(url: string) =>
    customFetch<ApiResponse<T>, E>(url, { method: 'DELETE' }),
};
