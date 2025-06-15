'use client'

import Image from 'next/image'
import React, { ReactNode } from 'react'

import * as S from './styles'

interface ChatBubbleProps {
  role: 'bot' | 'user'
  loading?: boolean
  children: ReactNode
  subDescription?: string
  buttonText?: string
  isAnswer?: boolean
  onClick?: () => void
}

export const ChatBubble = ({
  role,
  loading,
  children,
  subDescription,
  buttonText,
  isAnswer,
  onClick,
}: ChatBubbleProps) => (
  <S.Container role={role}>
    {role === 'bot' && (
      <S.Avatar>
        <Image src='/image/chatbot/chatbot_bubble.png' alt='chatbot' width={30} height={30} />
      </S.Avatar>
    )}
    <S.BubbleWrapper>
      <S.NameText role={role}>{role === 'bot' && '수피'}</S.NameText>
      <S.Bubble role={role} isAnswer={isAnswer}>
        {loading
          ? '잠시만 기다려주세요…'
          : typeof children === 'string'
            ? children.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))
            : children}
        {subDescription && <S.SubDescription role={role}>{subDescription}</S.SubDescription>}
        {buttonText && onClick && <S.RetryButton onClick={onClick}>{buttonText}</S.RetryButton>}
      </S.Bubble>
    </S.BubbleWrapper>
  </S.Container>
)
