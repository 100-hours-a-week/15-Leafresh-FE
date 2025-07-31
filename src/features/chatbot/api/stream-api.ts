export type RecommendationEvent = {
  event?: string
  status: number
  message: string
  data:
    | {
        // 최종 데이터
        recommend?: string
        challenges?: ChatChallenge[]
      }
    | null
    //토큰 스트리밍 data: string으로 적용용
    | string
}

export type ChatChallenge = {
  title: string
  description: string
  category: string
}

// SSE 스트림 생성 함수 (카테고리 기반)
export function createCategoryStream(
  sessionId: string,
  location: string,
  workType: string,
  category: string,
): EventSource {
  const params = new URLSearchParams({ sessionId, location, workType, category })
  return new EventSource(`https://leafresh.click/api/chatbot/recommendation/base-info?${params}`, {
    withCredentials: true,
  })
}

// SSE 스트림 생성 함수 (자유 텍스트)
export function createFreeTextStream(sessionId: string, message: string): EventSource {
  const params = new URLSearchParams({ sessionId, message })
  return new EventSource(`https://leafresh.click/api/chatbot/recommendation/free-text?${params}`)
}
