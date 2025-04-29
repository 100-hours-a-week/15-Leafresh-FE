import { useCallback, useRef, useState } from 'react'

/**
 * 객체 상태를 관리하는 커스텀 훅
 * @param initialState - 초기 상태 객체
 */
export function useObjectState<T extends object>(initialState: T) {
  if (typeof initialState !== 'object' || initialState === null || Array.isArray(initialState)) {
    throw new Error('useObjectState: initialState must be a non-null object')
  }

  const [state, setState] = useState<T>(initialState)
  const initialRef = useRef(initialState)

  const updateState = useCallback((partialState: Partial<T>) => {
    setState(prev => ({ ...prev, ...partialState }))
  }, [])

  const resetState = useCallback(() => {
    setState(initialRef.current)
  }, [])

  return { state, setState, updateState, resetState }
}
