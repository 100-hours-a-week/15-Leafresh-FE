'use client'
import { ReactNode, useEffect } from 'react'

export const TokenDeleter = (): ReactNode => {
  useEffect(() => {
    // prod 환경에서만 실행
    if (process.env.NEXT_PUBLIC_RUNTIME !== 'prod') return

    // 이미 클린업 했다면 종료
    const alreadyCleaned = sessionStorage.getItem('cleanup-token-called')
    if (alreadyCleaned) return

    // 1회 실행
    fetch('/api/cleanup-token', { method: 'DELETE' })
      .then(() => {
        console.log('✅ cleanup-token called')
        sessionStorage.setItem('cleanup-token-called', 'true')
      })
      .catch(() => {
        console.warn('❌ cleanup-token failed')
      })
  }, [])
  return <></>
}
