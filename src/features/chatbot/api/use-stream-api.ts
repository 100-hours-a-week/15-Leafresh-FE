import { useEffect, useRef } from 'react'

import { createCategoryStream, createFreeTextStream, RecommendationEvent } from './stream-api'

type Handler = (evt: RecommendationEvent) => void
export function useRecommendationStream() {
  const esRef = useRef<EventSource | null>(null)

  /** 카테고리 기반 스트림 시작 */
  function startCategoryStream(
    sessionId: string,
    location: string,
    workType: string,
    category: string,
    onChallenge: Handler,
    onError: Handler,
    onClose: (finalEvent: RecommendationEvent) => void,
  ) {
    // 기존 연결 닫기
    esRef.current?.close()

    // 새 EventSource 생성
    const es = createCategoryStream(sessionId, location, workType, category)
    esRef.current = es

    // 토큰 단위로 오는 챌린지 이벤트 수신
    es.addEventListener('challenge', e => {
      const evt = JSON.parse(e.data) as RecommendationEvent
      onChallenge(evt)
    })

    // 에러 발생 시
    es.addEventListener('error', (e: MessageEvent) => {
      try {
        const evt = JSON.parse(e.data) as RecommendationEvent
        onError(evt)
      } catch {
        onError({ status: 0, message: '스트림 처리 중 에러', data: null })
      }
      es.close()
    })

    // 마지막 close 이벤트 (final JSON payload)
    es.addEventListener('close', e => {
      const finalEvent = JSON.parse(e.data) as RecommendationEvent
      onClose(finalEvent)
      es.close()
    })
  }

  /** 자유 텍스트 기반 스트림 시작 */
  function startFreeTextStream(
    sessionId: string,
    message: string,
    onChallenge: Handler,
    onError: Handler,
    onClose: (finalEvent: RecommendationEvent) => void, // onClose 콜백 추가
  ) {
    // 이전 스트림 닫기
    esRef.current?.close()

    // 새 EventSource 생성
    const es = createFreeTextStream(sessionId, message)
    esRef.current = es

    let count = 0

    // 토큰 단위로 오는 챌린지 이벤트
    es.addEventListener('challenge', e => {
      const evt = JSON.parse(e.data) as RecommendationEvent
      onChallenge(evt)
      count++
      console.log(`[SSE] challenge #${count}:`, evt)
    })

    // 에러 발생 시
    es.addEventListener('error', (e: MessageEvent) => {
      try {
        const evt = JSON.parse(e.data) as RecommendationEvent
        onError(evt)
      } catch {
        onError({ status: 0, message: '스트림 처리 중 에러', data: null })
      }
      console.warn('[SSE] error event, closing stream')
      es.close()
    })

    // 마지막 close 이벤트 (final JSON payload)
    es.addEventListener('close', e => {
      try {
        const finalEvent = JSON.parse(e.data) as RecommendationEvent
        onClose(finalEvent) // 최종 결과 콜백 호출
      } catch {
        console.warn('[SSE] close event parsing failed')
      }
      es.close()
    })
  }

  // 컴포넌트 언마운트 시 반드시 닫기
  useEffect(() => {
    return () => {
      esRef.current?.close()
    }
  }, [])

  return { startCategoryStream, startFreeTextStream }
}
