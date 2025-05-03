import { useEffect } from 'react'

/**
 * 요소 바깥을 클릭했을 때 callback을 실행하는 커스텀 훅
 * @param ref 감지할 요소의 ref
 * @param callback 외부 클릭 시 호출할 콜백 (다양한 형태 허용)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOutsideClick<T extends HTMLElement, F extends (...args: any[]) => any>(
  ref: React.RefObject<T>,
  callback: F,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 개발 중에는 알려주고, 런타임에서는 무시
      if (!ref.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('useOutsideClick: ref must be included')
        }
        return
      }

      if (!ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}
