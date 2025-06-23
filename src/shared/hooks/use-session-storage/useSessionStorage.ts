import { useMemo } from 'react'

type SessionStorageValue = string | number | boolean | object | null

/**
 * 세션 스토리지에서 key에 해당하는 값을 가져오는 훅
 * @param key 조회할 로컬 스토리지 키 (생략하면 전체)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useSessionStorage<T extends SessionStorageValue = any>(
  key?: string,
): T | Record<string, unknown> | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null

    if (key) {
      const data = sessionStorage.getItem(key)
      if (data === null) return null

      try {
        return JSON.parse(data)
      } catch {
        return data // string 그대로 반환
      }
    }

    // key가 없으면 전체 로컬스토리지 반환
    const allData: Record<string, unknown> = {}
    let i = 0
    const sessionStorageLength = sessionStorage.length
    for (i; i < sessionStorageLength; i++) {
      const k = sessionStorage.key(i)
      if (!k) continue
      const data = sessionStorage.getItem(k)
      try {
        allData[k] = data ? JSON.parse(data) : null
      } catch {
        allData[k] = data
      }
    }

    return allData
  }, [key])
}
