import type React from 'react'

import { ChatSelectionProps } from '../../shared/components/chatbot/ChatSelection'

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
  isAnswer?: boolean
  actions?: {
    buttonText: string
    onClick: () => void
  }[]
}

export const LOCATION_OPSIONS: ChatOption[] = [
  { label: '도시', value: 'city' },
  { label: '바닷가', value: 'beach' },
  { label: '산', value: 'mountain' },
  { label: '농촌', value: 'rural' },
]

export const WORKTYPE_OPTIONS: ChatOption[] = [
  { label: '사무직', value: 'office' },
  { label: '현장직', value: 'field' },
  { label: '영업직', value: 'sales' },
  { label: '재택근무', value: 'remote' },
]

export const CHAT_CHALLENGE_OPTIONS: ChatOption[] = [
  { label: '제로웨이스트', value: 'ZERO_WASTE' },
  { label: '플로깅', value: 'PLOGGING' },
  { label: '탄소발자국', value: 'CARBON_FOOTPRINT' },
  { label: '에너지 절약', value: 'ENERGY_SAVING' },
  { label: '업사이클', value: 'UPCYCLE' },
  { label: '문화 공유', value: 'MEDIA' },
  { label: '디지털 탄소', value: 'DIGITAL_CARBON' },
  { label: '비건', value: 'VEGAN' },
]

export const categoryDescriptions: [string, string][] = [
  ['1. 제로웨이스트', '쓰레기를 줄이기 위한 실천'],
  ['2. 플로깅', '조깅하면서 쓰레기를 줍는 활동'],
  ['3. 탄소발자국', '나의 생활이 만드는 탄소량 줄이기'],
  ['4. 에너지 절약', '전기, 물, 가스 등을 절약하는 습관'],
  ['5. 업사이클', '버려지는 물건을 창의적으로 재활용'],
  ['6. 문화 공유', '환경 관련 문화나 콘텐츠 나누기'],
  ['7. 디지털 탄소', '데이터 사용을 줄이는 친환경 디지털 습관'],
  ['8. 비건', '동물성 제품을 줄여 환경 보호 실천하기'],
]

export const liveImages = [
  '/image/chatbot/beach.jpg',
  '/image/chatbot/city.jpg',
  '/image/chatbot/mountain.jpg',
  '/image/chatbot/farm.jpg',
]

export const workImages = [
  '/image/chatbot/athome.jpg',
  '/image/chatbot/sales.jpg',
  '/image/chatbot/fieldwork.jpg',
  '/image/chatbot/business.jpg',
]
