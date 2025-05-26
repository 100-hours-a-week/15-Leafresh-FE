'use client'

import Image from 'next/image'

import React, { ReactNode } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

export interface ChatBubbleProps {
  role: 'bot' | 'user'
  loading?: boolean
  children: ReactNode
  subDescription?: string
  buttonText?: string
  isAnswer?: boolean
  onClick?: () => void
}

const ChatBubble = ({ role, loading, children, subDescription, buttonText, isAnswer, onClick }: ChatBubbleProps) => (
  <Container role={role}>
    {role === 'bot' && (
      <Avatar>
        <Image src='/image/chatbot/chatbot_bubble.png' alt='chatbot' width={30} height={30} />
      </Avatar>
    )}
    <BubbleWrapper>
      <NameText role={role}>{role === 'bot' && '수피'}</NameText>
      <Bubble role={role} isAnswer={isAnswer}>
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
        {subDescription && <SubDescription role={role}>{subDescription}</SubDescription>}
        {buttonText && onClick && <RetryButton onClick={onClick}>{buttonText}</RetryButton>}
      </Bubble>
    </BubbleWrapper>
  </Container>
)

export default ChatBubble

const Container = styled.div<{ role: 'bot' | 'user' }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ role }) => (role === 'bot' ? 'flex-start' : 'flex-end')};
  gap: 8px;
`

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  order: ${({ role }) => (role === 'user' ? 1 : 0)};
`

const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 260px;
`

const NameText = styled.p<{ role: 'bot' | 'user' }>`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
  margin: 8px 0 0 0;
`

const Bubble = styled.div<{ role: 'bot' | 'user'; isAnswer?: boolean }>`
  max-width: 250px;
  min-width: 60px;
  padding: 16px 12px;
  line-height: 0.8rem;
  background: ${({ role, isAnswer }) =>
    isAnswer ? theme.colors.lfWhite.base : role === 'bot' ? '#AFF9BB' : theme.colors.lfWhite.base};
  color: ${({ role }) => (role === 'bot' ? '#333333' : `${theme.colors.lfBlack.base}`)};
  border: ${({ isAnswer }) => (isAnswer ? `solid 1px ${theme.colors.lfGreenBorder.base}` : 'none')};
  justify-content: center;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  white-space: pre-wrap;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
  box-shadow: ${theme.shadow.lfPrime};
`

const SubDescription = styled.div<{ role: 'bot' | 'user' }>`
  font-size: 10px;
  color: ${theme.colors.lfGreenMain.base};
  text-align: center;
  margin-bottom: 10px;
  white-space: pre-wrap;
  line-height: 1.4;
  max-width: 235px;
`

const RetryButton = styled.button`
  width: 164px;
  height: 37px;
  align-self: center;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border: none;
  border-radius: 10px;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  cursor: pointer;
  margin-top: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.base};
  }
`
