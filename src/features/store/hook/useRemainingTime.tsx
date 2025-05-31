import { ReactNode, useEffect, useState } from 'react'

interface useRemainingTimeProps {
  target: string
  className?: string
}

/** 현재 시각을 기준으로 남은 시간을 나타내는 타이머 */
const useRemainingTime = ({ target, className }: useRemainingTimeProps): ReactNode => {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(target).getTime()
      const diff = Math.max(0, end - now)

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0')
      const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')

      setTimeLeft(`${hours}:${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [target])

  return timeLeft
}

export default useRemainingTime
