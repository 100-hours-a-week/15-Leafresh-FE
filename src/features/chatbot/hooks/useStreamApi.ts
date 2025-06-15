import { useRef, useEffect } from 'react'
import { createCategoryStream, createFreeTextStream, RecommendationEvent } from '../stream-api'

type Handler = (evt: RecommendationEvent) => void
export function useRecommendationStream() {
  const esRef = useRef<EventSource | null>(null)

  /** 카테고리 기반 스트림 시작 */
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
    let count = 0

    console.log('[SSE] 카테고리 기반 스트림 연결 시작')

    es.addEventListener('challenge', e => {
      onChallenge(JSON.parse(e.data))
      count++
      console.log(`[SSE] challenge #${count}:`, e)
      // console.log(es)
      // console.log(e)
    })
    es.addEventListener('null', e => console.log(e))
    es.addEventListener('fallback', e => onFallback(JSON.parse(e.data)))
    es.addEventListener('null', e => {
      console.warn('[SSE] null event received:', e)
    })
    es.addEventListener('unknown', e => {
      console.warn('[SSE] unknown event received:', e.data)
    })
    es.addEventListener('error', e => {
      // evt.data는 string 혹은 undefined
      try {
        onError(JSON.parse((e as any).message))
      } catch {
        // console.log(es)
        // console.log(e)
        onError({ status: 0, message: '스트림 오류', data: null })
      }
    })
    es.addEventListener('close', () => {
      es.close()
      onClose()
    })
  }

  /** 자유 텍스트 기반 스트림 시작 */
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
    es.addEventListener('error', e => {
      try {
        onError(JSON.parse((e as any).data))
      } catch {
        onError({ status: 0, message: '스트림 오류', data: null })
      }
    })
    es.addEventListener('close', () => {
      es.close()
      onClose()
    })
  }

  // 컴포넌트 언마운트 시 반드시 닫기
  useEffect(() => {
    return () => {
      esRef.current?.close()
    }
  }, [])

  return { startCategory, startFreeText }
}
// export function useRecommendationStream() {
//   const esRef = useRef<EventSource | null>(null)

//   function startCategory(
//     sessionId: string,
//     location: string,
//     workType: string,
//     category: string,
//     onChallenge: Handler,
//     onFallback: Handler,
//     onError: Handler,
//     onClose: () => void,
//   ) {
//     esRef.current?.close()
//     const es = createCategoryStream(sessionId, location, workType, category)
//     esRef.current = es

//     es.addEventListener('challenge', e => onChallenge(JSON.parse(e.data)))
//     es.addEventListener('fallback', e => onFallback(JSON.parse(e.data)))
//     es.addEventListener('error', e => onError(JSON.parse((e as any).data)))
//     es.addEventListener('close', () => {
//       es.close()
//       onClose()
//     })
//   }

//   function startFreeText(
//     sessionId: string,
//     message: string,
//     onChallenge: Handler,
//     onFallback: Handler,
//     onError: Handler,
//     onClose: () => void,
//   ) {
//     esRef.current?.close()
//     const es = createFreeTextStream(sessionId, message)
//     esRef.current = es

//     es.addEventListener('challenge', e => onChallenge(JSON.parse(e.data)))
//     es.addEventListener('fallback', e => onFallback(JSON.parse(e.data)))
//     es.addEventListener('error', e => onError(JSON.parse((e as any).data)))
//     es.addEventListener('close', () => {
//       es.close()
//       onClose()
//     })
//   }

//   useEffect(() => {
//     return () => {
//       esRef.current?.close()
//     }
//   }, [])

//   return { startCategory, startFreeText }
// }
