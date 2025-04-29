import { useCallback, useState } from 'react'

/**
 * 토글 상태를 관리하는 커스텀 훅
 * @param initialValue 초기값 (기본값: false)
 */
export function useToggle(initialValue = false) {
  const [toggleValue, setToggleValue] = useState<boolean>(initialValue)

  /**
   * 현재 상태를 반전시키는 함수
   */
  const toggle = useCallback(() => {
    setToggleValue(prev => !prev)
  }, [])

  /**
   * 특정 boolean 값으로 설정하는 함수
   * @param nextValue 설정할 값
   */
  const setValue = useCallback((nextValue: boolean) => {
    setToggleValue(nextValue)
  }, [])

  return [toggleValue, toggle, setValue] as const
}
