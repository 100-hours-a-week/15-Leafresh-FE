// @features/member/hooks/useFeedbackSSE.ts
import { ENDPOINTS } from '@shared/constants/endpoint/endpoint'
import { useState } from 'react'

export const useFeedbackSSE = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const startFeedbackStream = () => {
    if (isStreaming) return

    const { path } = ENDPOINTS.MEMBERS.FEEDBACK
    const baseUrl = 'https://leafresh.app'
    const fullUrl = `${baseUrl}${path}`

    const eventSource = new EventSource(fullUrl)

    setIsStreaming(true)
    setMessages([])

    eventSource.onmessage = event => {
      if (event.data === 'FINISHED') {
        eventSource.close()
        setIsStreaming(false)
        setMessages(prev => [...prev, '피드백 완료'])
      } else {
        setMessages(prev => [...prev, event.data])
      }
    }

    eventSource.onerror = () => {
      setMessages(prev => [...prev, 'Error'])
      setIsStreaming(false)
      eventSource.close()
    }
  }

  return { messages, isStreaming, startFeedbackStream }
}
