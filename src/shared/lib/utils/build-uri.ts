export interface UrlBuilderOptions {
  query?: Record<string, string | number | boolean | undefined | null>
  fragment?: string
}

/**
 * 경로에 쿼리스트링과 해시(fragment)를 붙여주는 함수
 * @param path 기본 URL 경로
 * @param options query 객체, fragment 문자열
 * @returns ex) '/challenge/group/list?category=food&page=2#section1'
 */
export const buildURI = (path: string, options?: UrlBuilderOptions): string => {
  const { query, fragment } = options || {}
  const searchParams = new URLSearchParams()

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }

  const queryString = searchParams.toString()
  const fullPath = queryString ? `${path}?${queryString}` : path

  return fragment ? `${fullPath}#${fragment}` : fullPath
}
