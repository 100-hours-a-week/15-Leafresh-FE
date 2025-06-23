import type React from 'react'

import { ChatSelectionProps } from '@/features/chatbot/components/chat-selection'

export type ChatOption = {
  label: string
  value: string
}

export type ChatSelections = {
  location?: string
  workType?: string
  category?: string
}

export type ChatHistoryItem = {
  type: 'message' | 'selection' | 'horizontal-cards'
  role?: 'bot' | 'user'
  text?: React.ReactNode
  selectionProps?: ChatSelectionProps
  subDescription?: string
  buttonText?: string
  isAnswer?: boolean
  onClick?: () => void
}
