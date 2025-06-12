import { useEffect, useRef, useState } from 'react'

import { liveImages, workImages } from '@entities/chatbot/constants'
import { ChatSelections } from '@entities/chatbot/type'

export function useScrollToBottom(trigger: unknown) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [trigger])
  return ref
}

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const uuid = crypto.randomUUID()
    const timestamp = Date.now()
    const newSessionId = `${uuid}-${timestamp}`
    setSessionId(newSessionId)
  }, [])

  return sessionId
}

export function getDisplayLabel(value: string): string {
  const labelMap: Record<string, string> = {
    // 지역
    city: '도시',
    beach: '바닷가',
    mountain: '산',
    rural: '농촌',
    // 직장
    office: '사무직',
    field: '현장직',
    sales: '영업직',
    remote: '재택근무',
    // 챌린지
    zero: '제로웨이스트',
    plogging: '플로깅',
    vegan: '비건',
    energy: '에너지 절약',
    secondhand: '업사이클',
    carbon: '탄소발자국',
    media: '문화 공유',
    digital: '디지털 탄소',
  }

  return labelMap[value] || value
}

export function saveSelectionsToSession(selections: ChatSelections) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('chatSelections', JSON.stringify(selections))
}

export function loadSelectionsFromSession(): ChatSelections | null {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem('chatSelections')
  if (!stored) return null
  try {
    return JSON.parse(stored) as ChatSelections
  } catch {
    sessionStorage.removeItem('chatSelections')
    return null
  }
}

export function getRandomLiveImage(): string {
  const idx = Math.floor(Math.random() * liveImages.length)
  return liveImages[idx]
}

export function getRandomWorkImage(): string {
  const idx = Math.floor(Math.random() * workImages.length)
  return workImages[idx]
}
