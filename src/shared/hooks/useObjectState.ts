import { useCallback, useRef, useState } from 'react'

/**
 * 객체 상태를 관리하는 커스텀 훅
 * @param initialState - 초기 상태 객체
 */
export function useObjectState<T extends object>(initialState: T) {
  const [state, setState] = useState<T>(initialState)

  // 초기 상태를 기억하기 위한 ref
  const initialRef = useRef(initialState)

  /**
   * 객체의 일부만 업데이트하는 함수
   * @param partialState - 업데이트할 부분 객체
   */
  const updateState = useCallback((partialState: Partial<T>) => {
    setState(prev => ({ ...prev, ...partialState }))
  }, [])

  /**
   * 상태를 초기값으로 리셋하는 함수
   */
  const resetState = useCallback(() => {
    setState(initialRef.current)
  }, [])

  return [state, setState, updateState, resetState] as const
}
