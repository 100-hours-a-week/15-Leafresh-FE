'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { CHAT_CHALLENGE_OPTIONS, categoryDescriptions } from '../../../entities/chatbot/type'
// import { requestCategoryBasedRecommendation, requestFreetextBasedRecommendation } from '@features/chatbot'

import ChatBubble from './ChatBubble'
import ChatSelection from './ChatSelection'
import HorizontalCards from './HorizontalCards'

import { RecommendationResponse } from '@features/chatbot/chatbot-base-info'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { useChatHistory } from '../../../features/chatbot/hooks/useChatHistory'
import { useRecommendationStream } from '@features/chatbot/hooks/useStreamApi'
import { ChatChallenge, RecommendationEvent } from '@features/chatbot/stream-api'
import { useRouter } from 'next/navigation'
import { URL } from '@shared/constants/route/route'

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

  const [streamingText, setStreamingText] = useState<string | null>(null)
  const streamRef = useRef<string>('')
  const [finalChallenges, setFinalChallenges] = useState<ChatChallenge[]>([])
  const [finalActions, setFinalActions] = useState<{ buttonText: string; onClick: () => void }[] | undefined>(undefined)

  const [liveImage] = useState(() => getRandomLiveImage())
  const [workImage] = useState(() => getRandomWorkImage())

  const { history: chatHistory, addItem: addChatItem } = useChatHistory()
  const { startCategory, startFreeText } = useRecommendationStream()

  //dev 모드에서 소개 2번 렌더링 방지
  const hasInitializedRef = useRef(false)

  const sessionId = useChatSession()
  const messagesEndRef = useScrollToBottom([chatHistory, streamRef])

  const router = useRouter()
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

  // 거주 지역∙직장 형태 카드 렌더링
  const renderHorizontalCards = (): React.ReactNode[] => {
    const locationCard = (
      <ChatSelection
        selectionType='location'
        title='거주 지역 선택'
        subtitle='* 자신의 생활환경을 위해 선택해주세요.'
        imageUrl={liveImage}
        onSelect={handleLocationSelect}
      />
    )
    const workCard = (
      <ChatSelection
        selectionType='workType'
        title='직장 형태 선택'
        subtitle='* 자신의 직업환경을 위해 선택해주세요.'
        imageUrl={workImage}
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
            imageUrl: '/image/chatbot/chatbotcategory.png',
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
  {
    /* 텍스트 추가만
  const appendStream = (fragment: string) => {
    if (streamRef.current) {
      streamRef.current = ${streamRef.current} ${fragment}
    } else {
      streamRef.current = fragment
    }
    setStreamingText(streamRef.current)
  }
    */
  }

  //텍스트 추가 + ' ', '\n' 추가
  const appendStream = (fragment: string) => {
    // 1) 마침표·물음표·느낌표 뒤에 줄바꿈 삽입
    const processed = fragment.replace(/([.?!])\s*/g, '$1\n')

    // 1. 모든 </s> 토큰을 지운다
    const cleaned = fragment.replace(/<\/s>/g, '').trim()
    // 2. 비어있으면 무시
    if (!cleaned) return

    // 2) 이전 스트림에 공백 + processed 누적
    if (streamRef.current) {
      streamRef.current += ' ' + processed
    } else {
      streamRef.current = processed
    }

    // 3) 상태 업데이트
    setStreamingText(streamRef.current)
  }

  // 챌린지 카테고리 선택 핸들러
  const handleChallengeSelect = useCallback(
    (category: string) => {
      if (loading) return

      streamRef.current = ''
      setFinalActions(undefined)
      setLoading(true)

      // 1) 유저 메시지
      addChatItem({ type: 'message', role: 'user', text: getDisplayLabel(category) })
      updateChatSelections({ category })
      onSelect(category, 2)

      // 2) 스트리밍 텍스트 초기화
      setStreamingText('')

      // 3) SSE 시작 (challenge, error, close only)
      startCategory(
        sessionId!,
        chatSelections.location ?? '',
        chatSelections.workType ?? '',
        category,

        // onChallenge: 토큰 단편 누적
        (evt: RecommendationEvent) => {
          const frag = evt.data ?? ''
          if (typeof frag === 'string') {
            appendStream(frag)
          }
        },

        // onError: 에러 뱉고 로딩 해제
        (evt: RecommendationEvent) => {
          addChatItem({ type: 'message', role: 'bot', text: `오류: ${evt.message}` })
          setStreamingText(null)
          setLoading(false)
        },

        // onClose: final JSON payload로부터 액션 생성
        (finalEvt: RecommendationEvent) => {
          setLoading(false)

          const payload = finalEvt.data
          // payload 가 문자열이 아니고 챌린지 배열이 있으면
          if (payload !== null && typeof payload !== 'string' && Array.isArray(payload.challenges)) {
            const text = streamRef.current
            const actions = payload.challenges.map((ch, i) => ({
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
            setLoading(false)

            addChatItem({
              type: 'message',
              role: 'bot',
              text: text!,
              isAnswer: true,
              actions,
            })
          } else {
            console.warn('onClose payload error:', payload)
          }

          setTimeout(() => {
            addChatItem({
              type: 'selection',
              selectionProps: {
                title: '챌린지 선택',
                subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
                imageUrl: '/image/chatbot/chatbotcategory.png',
                options: CHAT_CHALLENGE_OPTIONS,
                selectionType: 'challenge',
                buttonText: '카테고리 설명',
                onExplainClick: handleExplainCategory,
                onSelect: handleChallengeSelect,
              },
            })
          }, 2000)
          streamRef.current = ''
          // 스트림 텍스트 초기화
          setStreamingText(null)
        },
      )
    },
    [
      loading,
      sessionId,
      chatSelections.location,
      chatSelections.workType,
      addChatItem,
      updateChatSelections,
      onSelect,
      startCategory,
      appendStream,
      streamingText,
      router,
    ],
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
          imageUrl: '/image/chatbot/chatbotcategory.png',
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
  const handleRetry = () => {
    if (loading) {
      setTimeout(() => handleRetry(), 1000)
      return
    }
    addChatItem({ type: 'message', role: 'bot', text: '참여하고 싶은 챌린지 유형을 선택해주세요!' })
    addChatItem({
      type: 'selection',
      selectionProps: {
        title: '챌린지 선택',
        subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
        imageUrl: '/image/chatbot/chatbotcategory.png',
        options: CHAT_CHALLENGE_OPTIONS,
        selectionType: 'challenge',
        buttonText: '카테고리 설명',
        onExplainClick: handleExplainCategory,
        onSelect: handleChallengeSelect,
      },
    })
    onRetry()
  }

  //자유 채팅 SSE 핸들러
  const handleSendMessage = useCallback(
    (txt: string) => {
      if (!txt.trim() || loading) return

      streamRef.current = ''
      setFinalActions(undefined)

      setLoading(true)

      // 1) 유저 메시지
      addChatItem({ type: 'message', role: 'user', text: txt })

      // 2) 스트리밍 텍스트 초기화
      setStreamingText('')

      // 3) SSE 시작
      startFreeText(
        sessionId!,
        txt,
        (evt: RecommendationEvent) => {
          const frag = evt.data ?? ''
          if (typeof frag === 'string') {
            appendStream(frag) // 내부에서 setStreamingText(t => t + frag)
          }
        },
        (evt: RecommendationEvent) => {
          let errorMessage = evt.message ?? ''

          addChatItem({
            type: 'message',
            role: 'bot',
            text: `${errorMessage}`,
          })
          setStreamingText(null)
          setLoading(false)
        },
        // onClose: 최종 payload 로부터 액션 생성 및 말풍선 추가
        (finalEvt: RecommendationEvent) => {
          setLoading(false)

          const payload = finalEvt.data
          if (payload !== null && typeof payload !== 'string' && Array.isArray(payload.challenges)) {
            // streamingText 에 누적된 텍스트
            const text = streamRef.current

            // 버튼 액션들 생성
            const actions = payload.challenges.map((ch, i) => ({
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

            addChatItem({
              type: 'message',
              role: 'bot',
              text,
              isAnswer: true,
              actions,
            })
            setFinalActions(actions)
          } else {
            console.warn('onClose payload error:', payload)
            addChatItem({
              type: 'message',
              role: 'bot',
              text: '죄송합니다. 결과를 처리하는 중 오류가 발생했습니다.',
            })
          }
          // 스트리밍 버블 지우기
          setStreamingText(null)
          // (선택) ref도 초기화
          streamRef.current = ''
        },
      )

      // 4) 입력창 초기화
      setInputText('')
    },
    [loading, sessionId, addChatItem, appendStream, startFreeText, router],
  )

  return (
    <Container>
      <MessagesContainer>
        {chatHistory.map((item, idx) => (
          <div key={idx}>
            {item.type === 'message' && item.role && (
              <ChatBubble
                role={item.role}
                subDescription={item.subDescription}
                isAnswer={item.isAnswer}
                actions={item.actions}
              >
                {item.text}
              </ChatBubble>
            )}

            {item.type === 'selection' && item.selectionProps && (
              <SelectionWrapper>
                <ChatSelection {...item.selectionProps} />
              </SelectionWrapper>
            )}

            {item.type === 'horizontal-cards' && (
              <HorizontalCards visibleIndex={visibleCardIndex} renderCards={renderHorizontalCards} />
            )}
          </div>
        ))}

        {streamingText !== null && (
          <ChatBubble role='bot' isAnswer actions={finalActions}>
            {streamingText}
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
