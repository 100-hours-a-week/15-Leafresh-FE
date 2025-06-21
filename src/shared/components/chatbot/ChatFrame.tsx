'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'

import { categoryDescriptions, CHAT_CHALLENGE_OPTIONS, initialMessages } from '@entities/chatbot/constants'
import {
  getDisplayLabel,
  getRandomLiveImage,
  getRandomWorkImage,
  loadSelectionsFromSession,
  saveSelectionsToSession,
  useChatSession,
  useScrollToBottom,
} from '@entities/chatbot/utils'
import { useChatbotSSE } from '@features/chatbot/hooks/useChatbotSSE'
import { useRecommendationStream } from '@features/chatbot/hooks/useStreamApi'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import { useChatHistory } from '../../../features/chatbot/hooks/useChatHistory'
import ChatBubble from './ChatBubble'
import ChatSelection from './ChatSelection'
import HorizontalCards from './HorizontalCards'

export interface ChatFrameProps {
  step: FrameStep
  onSelect: (value: string, step: FrameStep) => void
  onRetry: () => void
}

export type FrameStep = 1 | 2 | 3

export default function ChatFrame({ step, onSelect, onRetry }: ChatFrameProps) {
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)

  const [chatSelections, setChatSelections] = useState(() => loadSelectionsFromSession() || {})
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null)

  const [liveImage] = useState(() => getRandomLiveImage())
  const [workImage] = useState(() => getRandomWorkImage())

  //초기 세팅
  const { history: chatHistory, addItem: addChatItem } = useChatHistory(initialMessages)
  const { startCategoryStream, startFreeTextStream } = useRecommendationStream()

  // ——— 카테고리 스트림 훅 ———
  const {
    loading: catLoading,
    streamingText: catText,
    actions: catActions,
    start: startCatStream,
  } = useChatbotSSE(startCategoryStream, (text, actions) => {
    addChatItem({ type: 'message', role: 'bot', text, isAnswer: true, actions })
    //잠시 뒤 챌린지 선택창 재노출
    setTimeout(() => {
      addChatItem({
        type: 'selection',
        selectionProps: challengeSelectionProps,
      })
    }, 2000)
  })

  // ——— 자유채팅 스트림 훅 ———
  const {
    loading: freeLoading,
    streamingText: freeText,
    actions: freeActions,
    start: startFreeStream,
  } = useChatbotSSE(startFreeTextStream, (text, actions) => {
    addChatItem({ type: 'message', role: 'bot', text, isAnswer: true, actions })
    //잠시 뒤 챌린지 선택창 재노출
    setTimeout(() => {
      addChatItem({
        type: 'selection',
        selectionProps: challengeSelectionProps,
      })
    }, 2000)
  })

  const sessionId = useChatSession()
  const messagesEndRef = useScrollToBottom([chatHistory, catText, freeText])

  // chatSelections 업데이트, 세션 스토리지에 저장
  const updateChatSelections = (updates: Partial<typeof chatSelections>) => {
    setChatSelections(prev => {
      const next = { ...prev, ...updates }
      saveSelectionsToSession(next)
      return next
    })
  }

  // 지역 선택 핸들러
  const handleLocationSelect = (value: string) => {
    setSelectedLocation(value)
    updateChatSelections({ location: value })
    setVisibleCardIndex(1) // 두 번째 카드로 넘기기
  }

  // 직장 형태 선택 핸들러
  const handleWorkTypeSelect = (value: string) => {
    setSelectedWorkType(value)
    updateChatSelections({ workType: value })
  }

  const horizonCardData = useMemo(
    () => [
      {
        key: 'location',
        selectionType: 'location' as const,
        title: '거주 지역 선택',
        subtitle: '* 자신의 생활환경을 위해 선택해주세요.',
        imageUrl: liveImage,
        onSelect: handleLocationSelect,
      },
      {
        key: 'work',
        selectionType: 'workType' as const,
        title: '직장 형태 선택',
        subtitle: '* 자신의 직업환경을 위해 선택해주세요.',
        imageUrl: workImage,
        onSelect: handleWorkTypeSelect,
      },
    ],
    [liveImage, workImage, handleLocationSelect, handleWorkTypeSelect],
  )

  // 두 선택(지역 & 직장) 완료 시
  useEffect(() => {
    if (selectedLocation && selectedWorkType) {
      const locLabel = getDisplayLabel(selectedLocation)
      const workLabel = getDisplayLabel(selectedWorkType)

      // 사용자 메시지 추가
      addChatItem({ type: 'message', role: 'user', text: `${locLabel}, ${workLabel}` })

      setTimeout(() => {
        // 챌린지 카테고리 선택 요청
        addChatItem({ type: 'message', role: 'bot', text: '참여하고 싶은 챌린지 유형을 선택해주세요!' })
        addChatItem({
          type: 'selection',
          selectionProps: challengeSelectionProps,
        })
      }, 300)

      onSelect(selectedLocation, 1)
      onSelect(selectedWorkType, 1)

      setSelectedLocation(null)
      setSelectedWorkType(null)
    }
  }, [selectedLocation, selectedWorkType])

  // 챌린지 카테고리 선택 핸들러
  const handleChallengeSelect = useCallback(
    (category: string) => {
      if (catLoading) return

      // 유저 메시지
      addChatItem({ type: 'message', role: 'user', text: getDisplayLabel(category) })
      updateChatSelections({ category })
      onSelect(category, 2)

      // 카테고리 스트림 시작
      startCatStream(sessionId!, chatSelections.location ?? '', chatSelections.workType ?? '', category)
    },
    [catLoading, sessionId, chatSelections, startCatStream, addChatItem, updateChatSelections, onSelect],
  )

  //자유 채팅
  const handleSendMessage = useCallback(
    (txt: string) => {
      if (!txt.trim() || freeLoading) return

      // 유저 메시지
      addChatItem({ type: 'message', role: 'user', text: txt })
      setInputText('')
      // 자유채팅 스트림 시작
      startFreeStream(sessionId!, txt)
    },
    [freeLoading, sessionId, startFreeStream, addChatItem],
  )

  // 카테고리 설명 핸들러
  const handleExplainCategory = () => {
    addChatItem({ type: 'message', role: 'user', text: '카테고리 설명해줘' })
    const categoryDescription = categoryDescriptions.flatMap((pair: [string, string], idx: number) => [
      pair[0],
      <br key={`title-${idx}`} />,
      pair[1],
      <br key={`desc-${idx}`} />,
      <br key={`gap-${idx}`} />,
    ])

    setTimeout(() => addChatItem({ type: 'message', role: 'bot', text: categoryDescription }), 300)

    setTimeout(() => {
      addChatItem({
        type: 'selection',
        selectionProps: challengeSelectionProps,
      })
    }, 2000)
    onRetry()
  }

  const challengeSelectionProps = {
    title: '챌린지 선택',
    subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
    imageUrl: '/image/chatbot/chatbotcategory.png',
    options: CHAT_CHALLENGE_OPTIONS,
    selectionType: 'challenge' as const,
    buttonText: '카테고리 설명',
    onExplainClick: handleExplainCategory,
    onSelect: handleChallengeSelect,
  }

  return (
    <Container>
      <MessagesContainer>
        {chatHistory.map((item, idx) => {
          const { type, role, text, subDescription, actions, isAnswer, selectionProps } = item
          return (
            <div key={idx}>
              {type === 'message' && role && (
                <ChatBubble role={role} subDescription={subDescription} isAnswer={isAnswer} actions={actions}>
                  {text}
                </ChatBubble>
              )}

              {type === 'selection' && selectionProps && <ChatSelection {...selectionProps} />}

              {type === 'horizontal-cards' && (
                <HorizontalCards visibleIndex={visibleCardIndex} renderCards={horizonCardData} />
              )}
            </div>
          )
        })}
        {(catText || freeText) != null && (
          <ChatBubble role='bot' isAnswer actions={step === 2 ? catActions : freeActions}>
            {catText ? catText : freeText}
          </ChatBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {step >= 2 && (
        <InputContainer>
          <Input
            type='text'
            placeholder='메시지를 입력하세요 (최대 100자)'
            maxLength={100}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && inputText.trim()) {
                handleSendMessage(inputText)
              }
            }}
            disabled={catLoading || freeLoading}
          />
          <SendButton
            onClick={() => {
              if (inputText.trim()) {
                handleSendMessage(inputText)
              }
            }}
          >
            <LucideIcon name='ArrowUpRight' size={22} />
          </SendButton>
        </InputContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
`

const MessagesContainer = styled.div`
  display: flex;
  width: 100%;
  padding-right: 20px;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 10px;
`

const InputContainer = styled.div`
  display: flex;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
`

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;

  &::placeholder {
    color: #888888;
  }
`

const SendButton = styled.button`
  width: 44px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`
