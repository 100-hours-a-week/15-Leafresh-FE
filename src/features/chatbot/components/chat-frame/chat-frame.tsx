'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useChatHistory } from '@/features/chatbot/api'

import {
  RecommendationResponse,
  requestCategoryBasedRecommendation,
  requestFreetextBasedRecommendation,
} from '@/entities/chatbot/api'
import {
  categoryDescriptions,
  CHAT_CHALLENGE_OPTIONS,
  getDisplayLabel,
  getRandomLiveImage,
  getRandomWorkImage,
  loadSelectionsFromSession,
  saveSelectionsToSession,
  useChatSession,
  useScrollToBottom,
} from '@/entities/chatbot/model'

import { LucideIcon } from '@/shared/components'
import { HorizontalCards } from '@/shared/components/chatbot'

import { ChatBubble } from '../chat-bubble'
import { ChatSelection } from '../chat-selection'

import * as S from './styles'

export interface ChatFrameProps {
  step: FrameStep
  onSelect: (value: string, step: FrameStep) => void
  onRetry: () => void
}

export type FrameStep = 1 | 2 | 3

function formatChallengeResponse(challenges: { title: string; description: string }[]): string {
  return challenges.map((ch, i) => `${i + 1}. ${ch.title}\n  ${ch.description}`).join('\n\n')
}

export function ChatFrame({ step, onSelect, onRetry }: ChatFrameProps) {
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)

  const [chatSelections, setChatSelections] = useState(() => loadSelectionsFromSession() || {})
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null)
  const [liveImage] = useState(() => getRandomLiveImage())
  const [workImage] = useState(() => getRandomWorkImage())

  const { history: chatHistory, addItem: addChatItem } = useChatHistory()
  //dev 모드에서 소개 2번 렌더링 방지
  const hasInitializedRef = useRef(false)

  const sessionId = useChatSession()
  const messagesEndRef = useScrollToBottom(chatHistory)

  // mount 시 초기 메시지
  useEffect(() => {
    if (!hasInitializedRef.current) {
      addChatItem({
        type: 'message',
        role: 'bot',
        text:
          '안녕하세요! 저는 Leafresh의 챗봇 수피입니다.\n' +
          '저는 당신의 취향에 맞는 챌린지를 찾아드리고 싶어요!\n' +
          '먼저, 응답의 정확도를 위해 거주 지역과 직장 형태를 선택해주세요!',
      })
      addChatItem({ type: 'horizontal-cards' })

      // 한 번만 실행되도록 플래그를 true로 바꾼다.
      hasInitializedRef.current = true
    }
  }, [])

  // chatSelections가 바뀔 때마다 세션 스토리지에 저장
  useEffect(() => {
    saveSelectionsToSession(chatSelections)
  }, [chatSelections])

  // chatSelections 업데이트 헬퍼
  const updateChatSelections = (updates: Partial<typeof chatSelections>) => {
    setChatSelections(prev => {
      const next = { ...prev, ...updates }
      saveSelectionsToSession(next)
      return next
    })
  }

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
          selectionProps: {
            title: '챌린지 선택',
            subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
            imageUrl: 'https://storage.googleapis.com/leafresh-gcs-images/init/chatbot/chatbotcategory.png',
            options: CHAT_CHALLENGE_OPTIONS,
            selectionType: 'challenge',
            buttonText: '카테고리 설명',
            onExplainClick: handleExplainCategory,
            onSelect: handleChallengeSelect,
          },
        })
      }, 300)

      onSelect(selectedLocation, 1)
      onSelect(selectedWorkType, 1)

      setSelectedLocation(null)
      setSelectedWorkType(null)
    }
  }, [selectedLocation, selectedWorkType])

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

  // 거주 지역∙직장 형태 카드 렌더링
  const horizontalCards = useMemo<React.ReactNode[]>(
    () => [
      <ChatSelection
        key='loc'
        selectionType='location'
        title='거주 지역 선택'
        subtitle='* 자신의 생활환경을 위해 선택해주세요.'
        imageUrl={liveImage}
        onSelect={handleLocationSelect}
      />,
      <ChatSelection
        key='work'
        selectionType='workType'
        title='직장 형태 선택'
        subtitle='* 자신의 직업환경을 위해 선택해주세요.'
        imageUrl={workImage}
        onSelect={handleWorkTypeSelect}
      />,
    ],
    [liveImage, workImage, handleLocationSelect, handleWorkTypeSelect],
  )

  const renderHorizontalCards = useCallback(() => horizontalCards, [horizontalCards])

  // 챌린지 카테고리 선택 핸들러
  const handleChallengeSelect = useCallback(
    async (value: string): Promise<void> => {
      if (loading) return
      setLoading(true)

      // 사용자 메시지 추가
      addChatItem({ type: 'message', role: 'user', text: getDisplayLabel(value) })
      updateChatSelections({ category: value })

      try {
        const response = await requestCategoryBasedRecommendation({
          sessionId: sessionId || '',
          location: chatSelections.location || '',
          workType: chatSelections.workType || '',
          category: value,
        })
        const data = response.data as RecommendationResponse
        const { recommend, challenges } = data

        // const responseMessage = [recommend, <br key='r1' />, <br key='r2' />, ...formatChallengeResponse(challenges)]
        const responseMessage = recommend + '\n\n' + formatChallengeResponse(challenges)
        addChatItem({
          type: 'message',
          role: 'bot',
          text: responseMessage,
          loading: loading,
          subDescription: '* 카테고리 재선택 혹은 채팅으로 참여하고 싶은\n챌린지를 언급해주세요!',
          buttonText: '카테고리 재선택',
          isAnswer: true,
          onClick: handleRetry,
        })

        onSelect(value, 2)
      } catch (err) {
        const msg =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : '추천 중 오류가 발생했습니다. 다시 시도해주세요.'
        addChatItem({
          type: 'message',
          role: 'bot',
          text: `죄송합니다. ${msg}`,
          buttonText: '다시 시도',
          isAnswer: true,
          onClick: handleRetry,
        })
      } finally {
        setLoading(false)
      }
    },
    [loading, sessionId, chatSelections, addChatItem, onSelect],
  )

  // 카테고리 설명 핸들러
  const handleExplainCategory = () => {
    addChatItem({ type: 'message', role: 'user', text: '카테고리 설명해줘' })
    const descs = categoryDescriptions.flatMap((pair: [string, string], idx: number) => [
      pair[0],
      <br key={`title-${idx}`} />,
      pair[1],
      <br key={`desc-${idx}`} />,
      <br key={`gap-${idx}`} />,
    ])

    setTimeout(() => addChatItem({ type: 'message', role: 'bot', text: descs }), 300)

    setTimeout(() => {
      addChatItem({
        type: 'selection',
        selectionProps: {
          title: '챌린지 선택',
          subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
          imageUrl: 'https://storage.googleapis.com/leafresh-gcs-images/init/chatbot/chatbotcategory.png',
          options: CHAT_CHALLENGE_OPTIONS,
          selectionType: 'challenge',
          buttonText: '카테고리 설명',
          onExplainClick: handleExplainCategory,
          onSelect: handleChallengeSelect,
        },
      })
    }, 2000)

    onRetry()
  }

  // 재선택 핸들러
  const handleRetry = (): void => {
    if (loading) {
      return
    }
    addChatItem({ type: 'message', role: 'bot', text: '참여하고 싶은 챌린지 유형을 선택해주세요!' })
    addChatItem({
      type: 'selection',
      selectionProps: {
        title: '챌린지 선택',
        subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
        imageUrl: 'https://storage.googleapis.com/leafresh-gcs-images/init/chatbot/chatbotcategory.png',
        options: CHAT_CHALLENGE_OPTIONS,
        selectionType: 'challenge',
        buttonText: '카테고리 설명',
        onExplainClick: () => handleExplainCategory(),
        onSelect: value => handleChallengeSelect(value),
      },
    })
    onRetry()
  }

  // 자유 텍스트 전송 핸들러
  const handleSendMessage = useCallback(
    async (txt: string): Promise<void> => {
      if (!txt.trim() || loading) return
      setLoading(true)
      addChatItem({ type: 'message', role: 'user', text: txt })

      try {
        const response = await requestFreetextBasedRecommendation({
          sessionId: sessionId || '',
          location: chatSelections.location || '',
          workType: chatSelections.workType || '',
          message: txt,
        })
        const data = response.data as RecommendationResponse
        const { recommend, challenges } = data

        // const responseMessage = [recommend, <br key='r1' />, <br key='r2' />, ...formatChallengeResponse(challenges)]
        const responseMessage = recommend + '\n\n' + formatChallengeResponse(challenges)

        addChatItem({
          type: 'message',
          role: 'bot',
          text: responseMessage,
          loading: loading,
          subDescription: '* 카테고리 재선택 혹은 채팅으로 참여하고 싶은\n챌린지를 언급해주세요!',
          buttonText: '카테고리 재선택',
          isAnswer: true,
          onClick: handleRetry,
        })
      } catch (err) {
        let errorMessage = '오류가 발생했습니다. 다시 시도해주세요.'
        if (err && typeof err === 'object' && 'status' in err) {
          const status = (err as { status: number }).status
          if (status === 422) errorMessage = '메시지는 최소 5글자 이상 입력해주세요.'
          else if (status === 400) errorMessage = '메시지를 입력해주세요.'
          else if (status === 502) errorMessage = 'AI 서버 연결에 실패했습니다.'
          else if (status === 500) errorMessage = '서버 오류가 발생했습니다.'
        }
        addChatItem({
          type: 'message',
          role: 'bot',
          text: `죄송합니다. ${errorMessage}`,
          subDescription: '* 카테고리 재선택 혹은 채팅으로 참여하고 싶은\n챌린지를 언급해주세요!',
          buttonText: '카테고리 재선택',
          isAnswer: true,
          onClick: handleRetry,
        })
      } finally {
        setLoading(false)
        setInputText('')
      }
    },
    [loading, sessionId, chatSelections, addChatItem, handleRetry],
  )

  return (
    <S.Container>
      <S.MessagesContainer>
        {chatHistory.map((item, idx) => (
          <div key={idx}>
            {/* 메시지 타입 */}
            {item.type === 'message' && item.role && (
              <ChatBubble
                loading={item.loading}
                role={item.role}
                subDescription={item.subDescription}
                buttonText={item.buttonText}
                isAnswer={item.isAnswer}
                onClick={item.onClick}
              >
                {item.text}
              </ChatBubble>
            )}

            {/* 일반 선택지 타입 */}
            {item.type === 'selection' && item.selectionProps && (
              <S.SelectionWrapper>
                <ChatSelection {...item.selectionProps} />
              </S.SelectionWrapper>
            )}

            {/* 가로 스크롤 카드 타입 */}
            {item.type === 'horizontal-cards' && (
              <HorizontalCards visibleIndex={visibleCardIndex} renderCards={renderHorizontalCards} />
            )}
          </div>
        ))}

        {/* 자동 스크롤용 ref */}
        <div ref={messagesEndRef} />
      </S.MessagesContainer>

      {step >= 2 && (
        <S.InputContainer>
          <S.Input
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
          />
          <S.SendButton
            onClick={() => {
              if (inputText.trim()) {
                handleSendMessage(inputText)
              }
            }}
          >
            <LucideIcon name='ArrowUpRight' size={22} />
          </S.SendButton>
        </S.InputContainer>
      )}
    </S.Container>
  )
}
