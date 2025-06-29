import { useCallback, useEffect, useRef } from 'react'

let lockStack = 0 // 전역에서 관리

export function useScrollLock(enabled: boolean) {
  const scrollYRef = useRef<number>(0)

  const lockScroll = useCallback(() => {
    if (lockStack === 0) {
      scrollYRef.current = window.scrollY
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.overflowY = 'scroll'
      document.body.style.width = `calc(100% - ${scrollBarWidth}px)`
    }

    lockStack += 1
  }, [])

  const unlockScroll = useCallback(() => {
    lockStack = Math.max(0, lockStack - 1)

    if (lockStack === 0) {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.overflowY = ''
      document.body.style.width = ''
      document.body.style.paddingRight = ''

      window.scrollTo(0, scrollYRef.current)
    }
  }, [])

  useEffect(() => {
    if (enabled) lockScroll()
    return () => {
      if (enabled) unlockScroll()
    }
  }, [enabled, lockScroll, unlockScroll])

  return { lockScroll, unlockScroll }
}
