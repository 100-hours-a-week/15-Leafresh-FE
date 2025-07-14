'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence } from 'motion/react'

import { ChatFrame, FrameStep } from '../chat-frame'
import { ChatHeader } from '../chat-header'

import * as S from './styles'

export interface ChatWindowProps {
  open: boolean
  onClose: () => void
}

export function ChatWindow({ open, onClose }: ChatWindowProps) {
  // 선택 내용 저장
  const [selections, setSelections] = useState<{
    location?: string
    workType?: string
    challenge?: string
  }>({})
  const [resetCount, setResetCount] = useState(0)

  // 현재 단계 상태
  const [currentStep, setCurrentStep] = useState<FrameStep>(1)

  // 세션 스토리지에서 선택 데이터 로드
  useEffect(() => {
    if (open) {
      try {
        const storedData = sessionStorage.getItem('chatSelections')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          if (typeof parsedData === 'object') {
            setSelections(parsedData)

            // 저장된 데이터에 따라 적절한 단계 설정
            if (parsedData.challenge) {
              setCurrentStep(3) // 챌린지까지 선택 완료
            } else if (parsedData.location && parsedData.workType) {
              setCurrentStep(2) // 위치와 직장 형태 선택 완료
            } else {
              setCurrentStep(1) // 초기 단계
            }
          }
        }
      } catch (error) {
        console.error('Failed to load selections from sessionStorage:', error)
        setSelections({})
        setCurrentStep(1)
      }
    }
  }, [open])

  // 선택 처리 함수
  const handleSelect = (value: string, step: FrameStep) => {
    // 현재 단계에 따라 적절한 키에 값 저장
    const updatedSelections = { ...selections }

    if (step === 1) {
      // 첫 번째 단계에서는 위치와 직장 형태 선택
      if (!updatedSelections.location) {
        updatedSelections.location = value
      } else if (!updatedSelections.workType) {
        updatedSelections.workType = value
        setCurrentStep(2) // 두 가지 다 선택 완료 시 단계 2로 이동
      }
    } else if (step === 2) {
      // 두 번째 단계에서는 챌린지 선택
      updatedSelections.challenge = value
      setCurrentStep(3) // 챌린지 선택 완료 시 단계 3(채팅)으로 이동
    }

    // 상태 및 세션 스토리지 업데이트
    setSelections(updatedSelections)
    try {
      sessionStorage.setItem('chatSelections', JSON.stringify(updatedSelections))
    } catch (error) {
      console.error('Failed to save selections to sessionStorage:', error)
    }
  }

  // 재선택 처리 함수
  const handleRetry = () => {
    // 챌린지 선택만 초기화하고 단계 2로 돌아감
    const updatedSelections = {
      location: selections.location,
      workType: selections.workType,
    }

    setSelections(updatedSelections)
    setCurrentStep(2)

    try {
      sessionStorage.setItem('chatSelections', JSON.stringify(updatedSelections))
    } catch (error) {
      console.error('Failed to update sessionStorage:', error)
    }
  }

  // 전체 초기화 함수 (헤더의 닫기 버튼 등에서 호출할 수 있음)
  const handleReset = () => {
    setSelections({})
    setCurrentStep(1)
    setResetCount(prev => prev + 1)

    try {
      sessionStorage.removeItem('chatSelections')
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error)
    }

    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <S.MotionWindow
          key='chat-window'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.19, 1, 0.22, 1],
          }}
        >
          <ChatHeader close={handleReset} />
          <S.Body>
            <ChatFrame key={resetCount} step={currentStep} onSelect={handleSelect} onRetry={handleRetry} />
          </S.Body>
        </S.MotionWindow>
      )}
    </AnimatePresence>
  )
}
