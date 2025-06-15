import { useEffect, useState } from 'react'

export const useCountUp = (end: number, duration = 1500) => {
  const [count, setCount] = useState(0)

  // 훨씬 더 천천히 멈추는 느낌
  const extremeEaseOut = (t: number) => 1 - Math.pow(1 - t, 6)

  useEffect(() => {
    if (end == null) return

    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = extremeEaseOut(progress)
      const current = Math.floor(eased * end)

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [end, duration])

  return count
}
