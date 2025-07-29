import { useCallback, useState } from 'react'

import { ChatSelectionProps } from '../components/chat-selection'

export type ChatHistoryItem = {
  type: 'message' | 'selection' | 'horizontal-cards'
  role?: 'bot' | 'user'
  text?: React.ReactNode
  loading?: boolean
  selectionProps?: ChatSelectionProps
  subDescription?: string
  buttonText?: string
  isAnswer?: boolean
  actions?: { buttonText: string; onClick: () => void }[]
  onClick?: () => void
}

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
