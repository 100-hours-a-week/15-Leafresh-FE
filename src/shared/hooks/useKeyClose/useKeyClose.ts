import { useEffect } from 'react'

/** Typescript 표준 DOM 타입에는 KeyboardEvent.key는 string이다. */
type SupportedKeyType =
  | 'Escape'
  | 'Enter'
  | 'Tab'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Space'
  | 'Backspace'
  | 'Delete'
  | 'Shift'
  | 'Control'
  | 'Alt'

const normalizeKey = (key: SupportedKeyType): string => {
  if (key === 'Space') return ' '
  return key
}
/**
 * 특정 키 입력 시 콜백을 실행하는 커스텀 훅
 * @param key 입력할 키 (기본값: 'Escape')
 * @param ref 감지할 요소의 ref
 * @param callback 키 입력 시 실행할 함수
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useKeyClose<T extends HTMLElement, F extends (...args: any[]) => any>(
  key: SupportedKeyType = 'Escape',
  ref: React.RefObject<T>,
  callback: F,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!ref.current) {
        return
      }

      if (event.key === normalizeKey(key)) {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [key, ref, callback])
}
