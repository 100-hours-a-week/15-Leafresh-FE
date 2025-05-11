'use client'

import createCache from '@emotion/cache'

export const emotionCache = createCache({ key: 'css', prepend: false }) // prepend는 Emotion 스타일이 가장 먼저 적용되도록 보장합니다.
