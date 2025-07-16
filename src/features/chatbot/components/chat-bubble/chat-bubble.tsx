'use client'

import React, { ReactNode } from 'react'

import Image from 'next/image'

import { GCS_BUCKET } from '@/shared/constants'

import * as S from './styles'

export interface ChatBubbleProps {
  role: 'bot' | 'user'
  loading?: boolean
  children: ReactNode | string
  subDescription?: string
  isAnswer?: boolean
  actions?: {
    buttonText: string
    onClick: () => void
  }[]
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(function ChatBubble({
  role,
  loading,
  children,
  subDescription,
  isAnswer,
  actions,
}) {
  return (
    <S.Container role={role}>
      {role === 'bot' && (
        <S.Avatar role={role}>
          <Image
            src={`https://storage.googleapis.com/${GCS_BUCKET}/init/chatbot/chatbot_bubble.png`}
            alt='chatbot'
            width={30}
            height={30}
          />
        </S.Avatar>
      )}
      <S.BubbleWrapper>
        <S.NameText role={role}>{role === 'bot' ? '수피' : ''}</S.NameText>
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
          {actions?.map((act, i) => (
            <S.ActionButton key={i} onClick={act.onClick}>
              {act.buttonText}
            </S.ActionButton>
          ))}
        </S.Bubble>
      </S.BubbleWrapper>
    </S.Container>
  )
})
