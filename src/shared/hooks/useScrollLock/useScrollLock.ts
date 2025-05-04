'use client'
import { useCallback, useEffect, useRef } from 'react'

export function useScrollLock() {
  const scrollYRef = useRef<number>(0)
  const isLocked = useRef<boolean>(false)

  const lockScroll = useCallback(() => {
    if (isLocked.current) return
    scrollYRef.current = window.scrollY
    const scrollBarWidth: number = window.innerWidth - document.documentElement.clientWidth

    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.overflowY = 'auto'
    document.body.style.width = `calc(100% - ${scrollBarWidth}px)`

    isLocked.current = true
  }, [])

  const unLockScroll = useCallback(() => {
    if (!isLocked.current) return

    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.overflowY = ''
    document.body.style.width = ''

    window.scrollTo(0, scrollYRef.current)
    isLocked.current = false
  }, [])

  useEffect(() => {
    lockScroll()
    return () => unLockScroll()
  }, [])
}
