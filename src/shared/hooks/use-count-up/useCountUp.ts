import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * 0부터 일정 숫자까지 증가하는 커스텀 훅
 * @param endNumber 마지막 숫자
 * @param duration 지속시간
 * @returns 현재 숫자
 */
export const useCountUp = (endNumber: number, duration = 1500) => {
  const [count, setCount] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const previousValueRef = useRef<number | null>(null)

  const extremeEaseOut = useCallback((t: number) => {
    return 1 - Math.pow(1 - t, 6)
  }, [])

  useEffect(() => {
    if (endNumber == null) return

    // now: performance.now() 값
    const animate = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now
      }

      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = extremeEaseOut(progress)
      const current = Math.floor(eased * endNumber)

      if (previousValueRef.current !== current) {
        setCount(current)
        previousValueRef.current = current
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      startTimeRef.current = null
      previousValueRef.current = null
    }
  }, [endNumber, duration, extremeEaseOut])

  return count
}
