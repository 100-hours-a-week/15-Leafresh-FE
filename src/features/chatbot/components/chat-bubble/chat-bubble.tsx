'use client'

import React, { ReactNode } from 'react'

import Image from 'next/image'

import * as S from './styles'

export interface ChatBubbleProps {
  role: 'bot' | 'user'
  loading?: boolean
  children: ReactNode | string
  subDescription?: string
  buttonText?: string
  isAnswer?: boolean
  onClick?: () => void
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(function ChatBubble({
  role,
  loading = false,
  children,
  subDescription,
  buttonText,
  isAnswer,
  onClick,
}) {
  // 1) 로딩 중 텍스트
  // 2) children 이 문자열(string)일 때만 split 처리
  // 3) 나머지는 그대로 렌더링
  let content: ReactNode
  if (loading && role == 'bot') {
    content = '잠시만 기다려주세요…'
  } else if (typeof children === 'string') {
    content = children.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))
  } else {
    content = children
  }

  return (
    <S.Container role={role}>
      {role === 'bot' && (
        <S.Avatar role={role}>
          <Image
            src='https://storage.googleapis.com/leafresh-gcs-images/init/chatbot/chatbot_bubble.png'
            alt='chatbot'
            width={30}
            height={30}
          />
        </S.Avatar>
      )}
      <S.BubbleWrapper>
        <S.NameText role={role}>{role === 'bot' ? '수피' : ''}</S.NameText>
        <S.Bubble role={role} isAnswer={isAnswer}>
          {content}
          {subDescription && <S.SubDescription role={role}>{subDescription}</S.SubDescription>}
          {buttonText && onClick && <S.RetryButton onClick={onClick}>{buttonText}</S.RetryButton>}
        </S.Bubble>
      </S.BubbleWrapper>
    </S.Container>
  )
})
