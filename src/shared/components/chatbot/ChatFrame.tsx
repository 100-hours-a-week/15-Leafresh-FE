'use client'

import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

import {
  useScrollToBottom,
  useChatSession,
  getDisplayLabel,
  loadSelectionsFromSession,
  saveSelectionsToSession,
  getRandomLiveImage,
  getRandomWorkImage,
} from '../../../entities/chatbot/utils'
import { ChatHistoryItem, challengeOptions, categoryDescriptions } from '../../../entities/chatbot/type'
import { requestCategoryBasedRecommendation, requestFreetextBasedRecommendation } from '@features/chatbot'

import ChatBubble from './ChatBubble'
import ChatSelection from './ChatSelection'
import HorizontalCards from './HorizontalCards'

import { RecommendationResponse } from '@features/chatbot/chatbot-base-info'
import LucideIcon from '@shared/lib/ui/LucideIcon'

export interface ChatFrameProps {
  step: FrameStep
  onSelect: (value: string, step: FrameStep) => void
  onRetry: () => void
}

export type FrameStep = 1 | 2 | 3

export default function ChatFrame({ step, onSelect, onRetry }: ChatFrameProps) {
  const [inputText, setInputText] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [visibleCardIndex, setVisibleCardIndex] = useState(0)

  const [chatSelections, setChatSelections] = useState(() => loadSelectionsFromSession() || {})
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null)
  const [liveImage] = useState(() => getRandomLiveImage())
  const [workImage] = useState(() => getRandomWorkImage())

  const sessionId = useChatSession()
  const messagesEndRef = useScrollToBottom(chatHistory)

  //마운트 시 소개
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          type: 'message',
          role: 'bot',
          text: '안녕하세요! 저는 Leafresh의 챗봇 수피입니다.\n저는 당신의 취향에 맞는 챌린지를 찾아드리고 싶어요!\n먼저, 응답의 정확도를 위해 거주 지역과 직장 형태를 선택해주세요!',
        },
        { type: 'horizontal-cards' },
      ])
    }
  }, [])

  const updateChatSelections = (updates: Partial<typeof chatSelections>) => {
    setChatSelections(prev => {
      const next = { ...prev, ...updates }
      saveSelectionsToSession(next)
      return next
    })
  }

  const renderHorizontalCards = (): React.ReactNode[] => {
    const locationCard = (
      <ChatSelection
        selectionType='location'
        title='거주 지역 선택'
        subtitle='* 자신의 생활환경을 위해 선택해주세요.'
        imageUrl={liveImage} // util 함수 호출
        onSelect={handleLocationSelect}
      />
    )
    const workCard = (
      <ChatSelection
        selectionType='workType'
        title='직장 형태 선택'
        subtitle='* 자신의 직업환경을 위해 선택해주세요.'
        imageUrl={workImage} // util 함수 호출
        onSelect={handleWorkTypeSelect}
      />
    )
    return [locationCard, workCard]
  }

  // 두 선택(지역 & 직장) 완료 시
  useEffect(() => {
    if (selectedLocation && selectedWorkType) {
      const locLabel = getDisplayLabel(selectedLocation)
      const workLabel = getDisplayLabel(selectedWorkType)

      addChatItem('message', 'user', `${locLabel}, ${workLabel}`)
      setTimeout(() => {
        addChatItem('message', 'bot', '참여하고 싶은 챌린지 유형을 선택해주세요!')
        addChatItem('selection', undefined, undefined, {
          title: '챌린지 선택',
          subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
          imageUrl: '/image/chatbot/chatbotcategory.png',
          options: challengeOptions,
          selectionType: 'challenge',
          buttonText: '카테고리 설명',
          onExplainClick: handleExplainCategory,
          onSelect: handleChallengeSelect,
        })
      }, 300)

      onSelect(selectedLocation, 1)
      onSelect(selectedWorkType, 1)

      setSelectedLocation(null)
      setSelectedWorkType(null)
    }
  }, [selectedLocation, selectedWorkType])

  const handleLocationSelect = (value: string) => {
    setSelectedLocation(value)
    updateChatSelections({ location: value })
    setVisibleCardIndex(1)
  }

  const handleWorkTypeSelect = (value: string) => {
    setSelectedWorkType(value)
    updateChatSelections({ workType: value })
  }

  const handleChallengeSelect = async (value: string) => {
    if (loading) return
    setLoading(true)

    // 사용자 메시지로 선택값 표시
    addChatItem('message', 'user', getDisplayLabel(value))
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

      const responseMessage = [
        recommend,
        <br key='r1' />,
        <br key='r2' />,
        ...challenges.flatMap((ch: { title: string; description: string }, idx: number) => [
          `${idx + 1}. ${ch.title}`,
          <br key={`title-${idx}`} />,
          `\u00a0\u00a0${ch.description}`,
          <br key={`desc-${idx}`} />,
          <br key={`gap-${idx}`} />,
        ]),
      ]

      addChatItem(
        'message',
        'bot',
        responseMessage,
        undefined,
        '* 카테고리 재선택 혹은 채팅으로 참여하고 싶은\n 챌린지를 언급해주세요!',
        '카테고리 재선택',
        true,
        handleRetry,
      )

      onSelect(value, 2)
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : '추천 중 오류가 발생했습니다. 다시 시도해주세요.'
      addChatItem('message', 'bot', `죄송합니다. ${msg}`, undefined, undefined, '다시 시도', true, handleRetry)
    } finally {
      setLoading(false)
    }
  }

  const handleExplainCategory = () => {
    addChatItem('message', 'user', '카테고리 설명해줘')
    const descs = categoryDescriptions.flatMap((pair: [string, string], idx: number) => [
      pair[0],
      <br key={`title-${idx}`} />,
      pair[1],
      <br key={`desc-${idx}`} />,
      <br key={`gap-${idx}`} />,
    ])

    setTimeout(() => addChatItem('message', 'bot', descs), 300)

    setTimeout(() => {
      addChatItem('selection', undefined, undefined, {
        title: '챌린지 선택',
        subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
        imageUrl: '/image/chatbot/chatbotcategory.png',
        options: challengeOptions,
        selectionType: 'challenge',
        buttonText: '카테고리 설명',
        onExplainClick: handleExplainCategory,
        onSelect: handleChallengeSelect,
      })
    }, 2000)

    onRetry()
  }

  const handleRetry = () => {
    if (loading) {
      setTimeout(() => handleRetry(), 1000)
      return
    }
    addChatItem('message', 'bot', '참여하고 싶은 챌린지 유형을 선택해주세요!')
    addChatItem('selection', undefined, undefined, {
      title: '챌린지 선택',
      subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
      imageUrl: '/image/chatbot/chatbotcategory.png',
      options: challengeOptions,
      selectionType: 'challenge',
      buttonText: '카테고리 설명',
      onExplainClick: handleExplainCategory,
      onSelect: handleChallengeSelect,
    })
    onRetry()
  }

  const handleSendMessage = async (txt: string) => {
    if (!txt.trim() || loading) return
    setLoading(true)
    addChatItem('message', 'user', txt)

    const formatMultilineText = (t: string): React.ReactNode[] =>
      t.split('\n').flatMap((line: string, i: number) => [line, <br key={`line-${i}`} />])

    try {
      const response = await requestFreetextBasedRecommendation({
        sessionId: sessionId || '',
        location: chatSelections.location || '',
        workType: chatSelections.workType || '',
        message: txt,
      })

      const data = response.data as RecommendationResponse
      const { recommend, challenges } = data

      const responseMessage = [
        ...formatMultilineText(recommend),
        <br key='r2' />,
        ...challenges.flatMap((ch: { title: string; description: string }, idx: number) => [
          `${idx + 1}. ${ch.title}`,
          <br key={`title-${idx}`} />,
          `\u00a0\u00a0${ch.description}`,
          <br key={`desc-${idx}`} />,
          <br key={`gap-${idx}`} />,
        ]),
      ]

      addChatItem(
        'message',
        'bot',
        responseMessage,
        undefined,
        '* 카테고리 재선택 혹은 채팅으로 참여하고 싶은\n 챌린지를 언급해주세요!',
        '카테고리 재선택',
        true,
        handleRetry,
      )
    } catch (err) {
      let errorMessage = '오류가 발생했습니다. 다시 시도해주세요.'
      if (err && typeof err === 'object' && 'status' in err) {
        const status = (err as { status: number }).status
        if (status === 422) errorMessage = '메시지는 최소 5글자 이상 입력해주세요.'
        else if (status === 400) errorMessage = '메시지를 입력해주세요.'
        else if (status === 502) errorMessage = 'AI 서버 연결에 실패했습니다.'
        else if (status === 500) errorMessage = '서버 오류가 발생했습니다.'
      }
      addChatItem(
        'message',
        'bot',
        `죄송합니다. ${errorMessage}`,
        undefined,
        '* 카테고리 재선택 혹은 채팅으로 참여하고 싶은\n 챌린지를 언급해주세요!',
        '카테고리 재선택',
        true,
        handleRetry,
      )
    } finally {
      setLoading(false)
      setInputText('')
    }
  }

  const addChatItem = (
    type: ChatHistoryItem['type'],
    role?: ChatHistoryItem['role'],
    text?: React.ReactNode,
    selectionProps?: ChatHistoryItem['selectionProps'],
    subDescription?: string,
    buttonText?: string,
    isAnswer?: boolean,
    onClick?: () => void,
  ) => {
    setChatHistory(prev => [
      ...prev,
      { type, role, text, selectionProps, subDescription, buttonText, isAnswer, onClick },
    ])
  }

  return (
    <Container>
      <MessagesContainer>
        {chatHistory.map((item, idx) => (
          <div key={idx}>
            {/* 메시지 타입 */}
            {item.type === 'message' && item.role && (
              <ChatBubble
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
              <SelectionWrapper>
                <ChatSelection {...item.selectionProps} />
              </SelectionWrapper>
            )}

            {/* 가로 스크롤 카드 타입 */}
            {item.type === 'horizontal-cards' && (
              <HorizontalCards visibleIndex={visibleCardIndex} renderCards={renderHorizontalCards} />
            )}
          </div>
        ))}

        {/* 자동 스크롤용 ref */}
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

const SelectionWrapper = styled.div`
  margin: 8px 0;
  padding-left: 40px;
  width: 100%;
`

const SlideWrapper = styled.div`
  margin: 8px 0;
  padding-left: 40px;
  width: 100%;
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
