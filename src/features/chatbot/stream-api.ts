export interface RecommendationEvent {
  status: number
  message: string
  data: {
    challenges?: {
      title: string
      description: string
      category: string
      label: string
    }
  } | null
}

// SSE 스트림 생성 함수 (카테고리 기반)
export function createCategoryStream(
  sessionId: string,
  location: string,
  workType: string,
  category: string,
): EventSource {
  const params = new URLSearchParams({ sessionId, location, workType, category })
  return new EventSource(`/api/chatbot/recommendation/base-info?${params}`)
}

// SSE 스트림 생성 함수 (자유 텍스트)
export function createFreeTextStream(sessionId: string, message: string): EventSource {
  const params = new URLSearchParams({ sessionId, message })
  return new EventSource(`/api/chatbot/recommendation/free-text?${params}`)
}
