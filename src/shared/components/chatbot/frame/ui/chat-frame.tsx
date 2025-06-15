'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import {
  RecommendationResponseDataDTO,
  requestCategoryBasedRecommendation,
  requestFreetextBasedRecommendation,
} from '@entities/chatbot/api'
import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import SlideArea from '@shared/components/slidearea/ui/slide-area'

import { ChatBubble } from '../../bubble'
import { ChatSelection } from '../../selection'
import * as S from './styles'

// TODO: ENUM 으로 바꾸기
export type FrameStep = 1 | 2 | 3

interface ChatFrameProps {
  step: FrameStep
  onSelect: (value: string, step: FrameStep) => void
  onRetry: () => void
}

// chatSelections 타입 정의
interface ChatSelections {
  location?: string
  workType?: string
  category?: string
}

export function ChatFrame({ step, onSelect, onRetry }: ChatFrameProps) {
  const [inputText, setInputText] = useState('')
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: 'message' | 'selection' | 'horizontal-cards'
      role?: 'bot' | 'user'
      text?: React.ReactNode
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectionProps?: any
      subDescription?: string
      buttonText?: string
      isAnswer?: boolean
      onClick?: () => void
    }>
  >([])
  const [loading, setLoading] = useState(false)
  const [visibleCardIndex, setVisibleCardIndex] = useState(0) // 보여줄 카드 인덱스

  // chatSelections 상태
  const [chatSelections, setChatSelections] = useState<ChatSelections>({})

  // 선택 내용
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null)

  //sessionId
  const [sessionId, setSessionId] = useState<string | null>(null)

  const chatSelectionsRef = useRef(chatSelections)

  // 단일 상태로 통합하여 요청 처리 상태 관리
  // 0: 아무 작업 안함, 1: 카테고리 선택 중, 2: 채팅 전송 중
  const [requestStatus, setRequestStatus] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const randomLiveImage = [
    '/image/chatbot/beach.jpg',
    '/image/chatbot/city.jpg',
    '/image/chatbot/mountain.jpg',
    '/image/chatbot/farm.jpg',
  ]

  const randomWorkImage = [
    '/image/chatbot/athome.jpg',
    '/image/chatbot/sales.jpg',
    '/image/chatbot/fieldwork.jpg',
    '/image/chatbot/business.jpg',
  ]

  const liveImage = useMemo(() => randomLiveImage[Math.floor(Math.random() * randomLiveImage.length)], [])
  const workImage = useMemo(() => randomWorkImage[Math.floor(Math.random() * randomWorkImage.length)], [])

  // 메시지 영역으로 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  // SessionStorage에서 chatSelections 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSelections = sessionStorage.getItem('chatSelections')
      if (storedSelections) {
        try {
          setChatSelections(JSON.parse(storedSelections))
        } catch (error) {
          // 파싱 실패 시 초기화
          sessionStorage.removeItem('chatSelections')
        }
      }
    }
  }, [])

  // 가로 스크롤 카드 렌더링
  const renderHorizontalCards = () => {
    // 거주 지역 선택 카드
    const locationCard = (
      <ChatSelection
        title='거주 지역 선택'
        subtitle='* 자신의 생활환경을 위해 선택해주세요.'
        imageUrl={liveImage}
        options={[
          { label: '도시', value: '도시' },
          { label: '바닷가', value: '바닷가' },
          { label: '산', value: '산' },
          { label: '농촌', value: '농촌' },
        ]}
        selectionType='location'
        onSelect={handleLocationSelect}
      />
    )

    // 직장 형태 선택 카드
    const workTypeCard = (
      <ChatSelection
        title='직장 형태 선택'
        subtitle='* 자신의 직업환경을 위해 선택해주세요.'
        imageUrl={workImage}
        options={[
          { label: '사무직', value: '사무직' },
          { label: '현장직', value: '현장직' },
          { label: '영업직', value: '영업직' },
          { label: '재택근무', value: '재택근무' },
        ]}
        selectionType='workType'
        onSelect={handleWorkTypeSelect}
      />
    )

    return [locationCard, workTypeCard]
  }

  const updateChatSelections = (updates: Partial<ChatSelections>) => {
    setChatSelections(prev => ({ ...prev, ...updates }))
    chatSelectionsRef.current = { ...chatSelectionsRef.current, ...updates }
    sessionStorage.setItem('chatSelections', JSON.stringify(chatSelectionsRef.current))
  }

  // 초기 메시지 및 단계별 UI 설정
  useEffect(() => {
    if (chatHistory.length === 0) {
      // 최초 진입 시 초기 메시지 및 선택지 추가
      setChatHistory([
        {
          type: 'message',
          role: 'bot',
          text: '안녕하세요! 저는 Leafresh의 챗봇 수피입니다.\n저는 당신의 취향에 맞는 챌린지를 찾아드리고 싶어요!\n먼저, 응답의 정확도를 위해 거주 지역과 직장 형태를 선택해주세요!',
        },
        {
          type: 'horizontal-cards',
        },
      ])
    }
    const uuid = crypto.randomUUID()
    const timestamp = Date.now()
    const newSessionId = `${uuid}-${timestamp}`
    setSessionId(newSessionId)
  }, [])

  // 두 선택이 모두 완료되었을 때 메시지 추가 및 다음 단계로 진행
  useEffect(() => {
    if (selectedLocation && selectedWorkType) {
      // 두 선택 모두 완료됐을 때만 사용자 메시지로 추가
      const locationLabel = getDisplayLabel(selectedLocation)
      const workTypeLabel = getDisplayLabel(selectedWorkType)

      // 선택 내용을 하나의 메시지로 추가
      addChatItem('message', 'user', `${locationLabel}, ${workTypeLabel}`)
      // 다음 단계 안내 메시지
      setTimeout(() => {
        addChatItem('message', 'bot', '참여하고 싶은 챌린지 유형을 선택해주세요!')

        // 챌린지 카테고리 선택지 추가
        addChatItem('selection', undefined, undefined, {
          title: '챌린지 선택',
          subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
          imageUrl: '/image/chatbot/chatbotcategory.png',
          options: [
            { label: '제로웨이스트', value: '제로웨이스트' },
            { label: '플로깅', value: '플로깅' },
            { label: '탄소발자국', value: '탄소발자국' },
            { label: '에너지 절약', value: '에너지 절약' },
            { label: '업사이클', value: '업사이클' },
            { label: '문화 공유', value: '문화 공유' },
            { label: '디지털 탄소', value: '디지털 탄소' },
            { label: '비건', value: '비건' },
          ],
          selectionType: 'challenge',
          buttonText: '카테고리 설명',
          onExplainClick: handleExplainCategory,
          onSelect: handleChallengeSelect,
        })
      }, 300)

      // 선택 정보를 부모 컴포넌트로 전달
      onSelect(selectedLocation, 1)
      onSelect(selectedWorkType, 1)

      // 임시 저장값 초기화
      setSelectedLocation(null)
      setSelectedWorkType(null)
    }
  }, [selectedLocation, selectedWorkType])

  // 거주 지역 선택 처리
  const handleLocationSelect = (value: string) => {
    // 임시 저장
    setSelectedLocation(value)

    // chatSelections 업데이트
    updateChatSelections({ location: value })

    // 직장 형태 카드 보이게 설정
    setVisibleCardIndex(1)
  }

  // 직장 형태 선택 처리
  const handleWorkTypeSelect = (value: string) => {
    // 임시 저장
    setSelectedWorkType(value)

    // chatSelections 업데이트
    updateChatSelections({ workType: value })
  }

  // 챌린지 선택 처리
  const handleChallengeSelect = async (value: string) => {
    // 다른 요청이 처리 중이면 중복 처리 방지
    if (requestStatus !== 0) {
      return
    }

    // 카테고리 전송 시작 표시 (상태: 1)
    setRequestStatus(1)

    try {
      // 1) user 선택 반영
      const displayValue = getDisplayLabel(value)
      addChatItem('message', 'user', displayValue)

      // 2) ref를 즉시 동기 갱신
      updateChatSelections({ category: value })

      // 챌린지 추천 로딩 표시
      setLoading(true)

      // API 호출 - 카테고리 기반 추천
      const response = await requestCategoryBasedRecommendation({
        sessionId: sessionId || '',
        location: chatSelectionsRef.current.location || '',
        workType: chatSelectionsRef.current.workType || '',
        category: value,
      })

      // API 응답 데이터 처리
      const { recommend, challenges } = response.data as RecommendationResponseDataDTO

      // 응답 메시지 구성
      const responseMessage = [
        recommend,
        <br key='r1' />,
        <br key='r2' />,
        ...challenges.flatMap((challenge, index) => [
          `${index + 1}. ${challenge.title}`,
          <br key={`title-${index}`} />,
          `\u00a0\u00a0${challenge.description}`,
          <br key={`desc-${index}`} />,
          <br key={`gap-${index}`} />,
        ]),
      ]

      // 카테고리 재선택 버튼 추가
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

      // 상위 콜백 호출 - 챌린지 선택은 step 2
      onSelect(value, 2)
    } catch (error: unknown) {
      let errorMsg: string

      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMsg = String((error as { message?: string }).message)
      } else {
        errorMsg = '추천 과정에서 오류가 발생했습니다. 다시 시도해주세요.'
      }

      addChatItem('message', 'bot', `죄송합니다. ${errorMsg}`, undefined, undefined, '다시 시도', true, handleRetry)
    } finally {
      // 항상 로딩과 요청 상태 초기화
      setLoading(false)
      // 요청 처리 완료 (상태: 0)
      setRequestStatus(0)
    }
  }

  const handleExplainCategory = () => {
    addChatItem('message', 'user', '카테고리 설명해줘')

    const categoryDescriptions = [
      ['1. 제로웨이스트', '쓰레기를 줄이기 위한 실천'],
      ['2. 플로깅', '조깅하면서 쓰레기를 줍는 활동'],
      ['3. 탄소발자국', '나의 생활이 만드는 탄소량 줄이기'],
      ['4. 에너지 절약', '전기, 물, 가스 등을 절약하는 습관'],
      ['5. 업사이클', '버려지는 물건을 창의적으로 재활용'],
      ['6. 문화 공유', '환경 관련 문화나 콘텐츠 나누기'],
      ['7. 디지털 탄소', '데이터 사용을 줄이는 친환경 디지털 습관'],
      ['8. 비건', '동물성 제품을 줄여 환경 보호 실천하기'],
    ].flatMap(([title, desc], idx) => [
      title, // 1. 항목명
      <br key={`t-${idx}`} />,
      desc, //    설명
      <br key={`d-${idx}`} />,
      <br key={`s-${idx}`} />, // 빈 줄
    ])

    setTimeout(() => {
      addChatItem('message', 'bot', categoryDescriptions)
    }, 300)
    setTimeout(() => {
      addChatItem('selection', undefined, undefined, {
        title: '챌린지 선택',
        subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
        imageUrl: '/image/chatbotcategory.png',
        options: [
          { label: '제로웨이스트', value: '제로웨이스트' },
          { label: '플로깅', value: '플로깅' },
          { label: '비건', value: '비건' },
          { label: '에너지 절약', value: '에너지 절약' },
          { label: '업사이클', value: '업사이클' },
          { label: '탄소발자국', value: '탄소발자국' },
          { label: '문화 공유', value: '문화 공유' },
          { label: '디지털 탄소', value: '디지털 탄소' },
        ],
        selectionType: 'challenge',
        buttonText: '카테고리 설명',
        onExplainClick: handleExplainCategory,
        onSelect: handleChallengeSelect,
      })
    }, 2000)

    onRetry()
  }

  // 재선택 처리
  const handleRetry = () => {
    // 재선택 처리 시작 전 요청 상태 확인
    if (requestStatus !== 0) {
      // 1초 후 재시도 (요청 상태가 초기화되길 기다림)
      setTimeout(() => handleRetry(), 1000)
      return
    }

    // 요청 상태 초기화 보장 (상태: 0)
    setRequestStatus(0)

    addChatItem('message', 'bot', '참여하고 싶은 챌린지 유형을 선택해주세요!')

    // 챌린지 카테고리 선택지 다시 추가
    addChatItem('selection', undefined, undefined, {
      title: '챌린지 선택',
      subtitle: '*참여하고 싶은 챌린지를 선택해주세요.',
      imageUrl: '/image/chatbot/chatbotcategory.png',
      options: [
        { label: '제로웨이스트', value: '제로웨이스트' },
        { label: '플로깅', value: '플로깅' },
        { label: '탄소발자국', value: '탄소발자국' },
        { label: '에너지 절약', value: '에너지 절약' },
        { label: '업사이클', value: '업사이클' },
        { label: '문화 공유', value: '문화 공유' },
        { label: '디지털 탄소', value: '디지털 탄소' },
        { label: '비건', value: '비건' },
      ],
      selectionType: 'challenge',
      buttonText: '카테고리 설명',
      onExplainClick: handleExplainCategory,
      onSelect: handleChallengeSelect,
    })

    // 상위 콜백 호출
    onRetry()
  }

  // 채팅 아이템 추가 함수
  const addChatItem = (
    type: 'message' | 'selection' | 'horizontal-cards',
    role?: 'bot' | 'user',
    text?: React.ReactNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectionProps?: any,
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

  // 사용자 메시지 전송 처리
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // 이미 다른 요청이 처리 중인 경우 중복 방지
    if (requestStatus !== 0) {
      return
    }

    const formatMultilineText = (text: string): React.ReactNode[] => {
      return text.split('\n').flatMap((line, i) => [line, <br key={`line-${i}`} />])
    }

    // 채팅 전송 시작 표시 (상태: 2)
    setRequestStatus(2)
    addChatItem('message', 'user', text)
    setLoading(true)

    try {
      // API 호출 - 자유 텍스트 기반 추천
      const response = await requestFreetextBasedRecommendation({
        sessionId: sessionId || '',
        location: chatSelections.location || '',
        workType: chatSelections.workType || '',
        message: text,
      })

      // API 응답 데이터 처리
      const { recommend, challenges } = response.data as RecommendationResponseDataDTO

      // 응답 메시지 구성
      const responseMessage = [
        ...formatMultilineText(recommend),
        <br key='r2' />,
        ...challenges.flatMap((challenge, index) => [
          `${index + 1}. ${challenge.title}`,
          <br key={`title-${index}`} />,
          `\u00a0\u00a0${challenge.description}`,
          <br key={`desc-${index}`} />,
          <br key={`gap-${index}`} />,
        ]),
      ]

      // 카테고리 재선택 버튼 추가
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
    } catch (error: unknown) {
      let errorMessage: string

      if (typeof error === 'object' && error !== null && 'status' in error) {
        const status = (error as { status: number }).status

        if (status === 422) {
          errorMessage = '메시지는 최소 5글자 이상 입력해주세요.'
        } else if (status === 400) {
          errorMessage = '메시지를 입력해주세요.'
        } else if (status === 502) {
          errorMessage = 'AI 서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.'
        } else if (status === 500) {
          errorMessage = '서버에 오류로 인해 추천이 실패했습니다.\n다시 시도해주세요!'
        } else {
          errorMessage = '오류가 발생했습니다. 다시 시도해주세요.'
        }
      } else {
        errorMessage = '오류가 발생했습니다. 다시 시도해주세요.'
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
      // 모든 처리가 완료된 후 상태 초기화
      setLoading(false)
      // 요청 처리 완료 (상태: 0)
      setRequestStatus(0)
      setInputText('')
    }
  }

  // 선택값을 표시 가능한 레이블로 변환
  const getDisplayLabel = (value: string): string => {
    const labelMap: Record<string, string> = {
      // 지역
      city: '도시',
      beach: '바닷가',
      mountain: '산',
      rural: '농촌',
      // 직장
      office: '사무직',
      field: '현장직',
      sales: '영업직',
      remote: '재택근무',
      // 챌린지
      zero: '제로웨이스트',
      plogging: '플로깅',
      vegan: '비건',
      energy: '에너지 절약',
      secondhand: '업사이클',
      carbon: '탄소발자국',
      media: '문화 공유',
      digital: '디지털 탄소',
    }

    return labelMap[value] || value
  }

  return (
    <S.Container>
      {/* 채팅 히스토리 */}
      <S.MessagesContainer>
        {chatHistory.map((item, index) => (
          <div key={index}>
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
              <S.SelectionWrapper>
                <ChatSelection {...item.selectionProps} />
              </S.SelectionWrapper>
            )}

            {/* 가로 스크롤 카드 타입 */}
            {item.type === 'horizontal-cards' && (
              <S.SlideWrapper>
                <SlideArea visibleIndex={visibleCardIndex}>{renderHorizontalCards()}</SlideArea>
              </S.SlideWrapper>
            )}
          </div>
        ))}

        {/* 로딩 표시 */}
        {loading && (
          <ChatBubble role='bot' loading={true}>
            로딩 중...
          </ChatBubble>
        )}

        {/* 자동 스크롤용 ref */}
        <div ref={messagesEndRef} />
      </S.MessagesContainer>

      {/* 채팅 입력창 (Step 3 이상일 때만 표시) */}
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
