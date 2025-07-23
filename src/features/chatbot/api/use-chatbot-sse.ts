import { useCallback, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { URL } from '@/shared/constants'

import type { ChatChallenge, RecommendationEvent } from './stream-api'

type Action = { buttonText: string; onClick: () => void }
type Handler = (evt: RecommendationEvent) => void

export function useChatbotSSE<Params extends unknown[]>(
  startFn: (sessionId: string, ...args: [...Params, Handler, Handler, Handler]) => void,
  onComplete: (text: string, actions: Action[]) => void,
) {
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState<string | null>(null)
  const [actions, setActions] = useState<Action[]>()
  const streamRef = useRef('')
  const router = useRouter()

  const appendStream = useCallback((fragment: string) => {
    // 1) 모든 </s> 토큰을 제거하고 trim
    const cleaned = fragment.replace(/<\/s>/g, '').trim()
    if (!cleaned) return

    // 2) 마침표·물음표·느낌표 뒤에 줄바꿈 삽입
    const processed = cleaned
    // .replace(/([.?!])\s*/g, '$1\n')

    // 3) 이전 스트림에 공백 + processed 누적
    streamRef.current = streamRef.current ? `${streamRef.current} ${processed}` : processed

    // 4) 상태 업데이트
    setStreamingText(streamRef.current)
  }, [])

  const start = useCallback(
    (sessionId: string, ...params: Params) => {
      setLoading(true)
      streamRef.current = ''
      setStreamingText('')

      startFn(
        sessionId,
        ...params,
        // onData
        (evt: RecommendationEvent) => {
          // evt.data 가 null 이 아닌 경우만 처리
          if (typeof evt.data === 'string') {
            appendStream(evt.data)
          }
        },
        // onError
        (_errEvt: RecommendationEvent) => {
          setLoading(false)
          // 에러 처리…
        },
        // onClose
        (finalEvt: RecommendationEvent) => {
          setLoading(false)
          const payload = finalEvt.data

          // payload 가 null 이 아니고, 객체이며, challenges 배열이 있을 때만
          if (payload != null && typeof payload !== 'string' && Array.isArray(payload.challenges)) {
            const text = streamRef.current
            const newActions: Action[] = payload.challenges.map((ch: ChatChallenge, i: number) => ({
              buttonText: `챌린지 생성 ${i + 1}`,
              onClick: () => {
                const params = new URLSearchParams()
                params.set('category', ch.category)
                params.set('title', ch.title)
                params.set('description', ch.description)
                const base = URL.CHALLENGE.GROUP.CREATE.value()
                router.push(`${base}?${params.toString()}`)
              },
            }))
            setActions(newActions)
            onComplete(text, newActions)
            setStreamingText(null)
          } else {
            console.warn('onClose: 예상치 못한 payload', payload)
          }
        },
      )
    },
    [startFn, appendStream, onComplete],
  )

  return { loading, streamingText, actions, start, router }
}
