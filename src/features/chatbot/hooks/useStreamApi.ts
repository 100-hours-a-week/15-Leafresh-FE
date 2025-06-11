import { useRef, useEffect } from 'react'
import { createCategoryStream, createFreeTextStream, RecommendationEvent } from '../stream-api'

type Handler = (evt: RecommendationEvent) => void

export function useRecommendationStream() {
  const esRef = useRef<EventSource | null>(null)

  function startCategory(
    sessionId: string,
    location: string,
    workType: string,
    category: string,
    onChallenge: Handler,
    onFallback: Handler,
    onError: Handler,
    onClose: () => void,
  ) {
    esRef.current?.close()
    const es = createCategoryStream(sessionId, location, workType, category)
    esRef.current = es

    es.addEventListener('challenge', e => onChallenge(JSON.parse(e.data)))
    es.addEventListener('fallback', e => onFallback(JSON.parse(e.data)))
    es.addEventListener('error', e => onError(JSON.parse((e as any).data)))
    es.addEventListener('close', () => {
      es.close()
      onClose()
    })
  }

  function startFreeText(
    sessionId: string,
    message: string,
    onChallenge: Handler,
    onFallback: Handler,
    onError: Handler,
    onClose: () => void,
  ) {
    esRef.current?.close()
    const es = createFreeTextStream(sessionId, message)
    esRef.current = es

    es.addEventListener('challenge', e => onChallenge(JSON.parse(e.data)))
    es.addEventListener('fallback', e => onFallback(JSON.parse(e.data)))
    es.addEventListener('error', e => onError(JSON.parse((e as any).data)))
    es.addEventListener('close', () => {
      es.close()
      onClose()
    })
  }

  useEffect(() => {
    return () => {
      esRef.current?.close()
    }
  }, [])

  return { startCategory, startFreeText }
}
