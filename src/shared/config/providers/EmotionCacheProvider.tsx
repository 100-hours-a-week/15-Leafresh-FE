import { ReactNode } from 'react'
import { CacheProvider } from '@emotion/react'

import { emotionCache } from '@shared/styles/emotion/emotion-cache'

/**
 * Emotion의 SSR 지원 Provider
 */
export function EmotionCacheProvider({ children }: { children: ReactNode }) {
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>
}
