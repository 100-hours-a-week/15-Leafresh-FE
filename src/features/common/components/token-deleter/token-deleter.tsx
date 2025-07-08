'use client'

import { useEffect } from 'react'

import { useSessionStorage } from '@/shared/hooks'

export const AppInit = () => {
  const cleanupFlag = useSessionStorage('cleanup-token')

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_RUNTIME !== 'prod') return
    if (cleanupFlag) return

    fetch('/api/cleanup-token', { method: 'DELETE' })
      .then(() => {
        sessionStorage.setItem('cleanup-token', 'true')
        console.log('✅ cleanup-token called')
      })
      .catch(() => {
        console.warn('❌ cleanup-token failed')
      })
  }, [cleanupFlag])

  return null
}
