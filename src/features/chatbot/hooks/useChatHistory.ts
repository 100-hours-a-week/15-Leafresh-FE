import { useCallback, useState } from 'react'

import type { ChatHistoryItem } from '@entities/chatbot/type'

/**
 * 채팅 히스토리와 메시지를 추가하는 함수를 제공하는 커스텀 훅
 */
export function useChatHistory(initialHistory: ChatHistoryItem[] = []) {
  const [history, setHistory] = useState<ChatHistoryItem[]>(() => initialHistory)

  // 새로운 ChatHistoryItem 을 배열 끝에 추가
  const addItem = useCallback((item: ChatHistoryItem) => {
    setHistory(prev => [...prev, item])
  }, [])

  return { history, addItem }
}
