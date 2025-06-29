import { useEffect } from 'react'

/**
 * 언마운트 시점에 콜백 함수를 실행하는 훅
 * @param callback 언마운트 시 실행할 함수
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUnmount<F extends (...args: any[]) => any>(callback: F) {
  useEffect(() => {
    return () => {
      callback()
    }
  }, [])
}
