// app/emotion-cache.ts
'use client'

import { ReactNode } from 'react'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

// key는 고유해야 하며, 보통 'css'를 사용합니다.
// prepend는 Emotion 스타일이 가장 먼저 적용되도록 보장합니다.
export const emotionCache = createCache({ key: 'css', prepend: true })

export function EmotionCacheProvider({ children }: { children: ReactNode }) {
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>
}
