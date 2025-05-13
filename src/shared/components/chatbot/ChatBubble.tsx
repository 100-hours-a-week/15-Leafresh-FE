'use client'

import Image from 'next/image'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

export interface ChatBubbleProps {
  role: 'bot' | 'user'
  loading?: boolean
  children: ReactNode
  subDescription?: string // Add subDescription prop
  buttonText?: string
  onClick?: () => void
}

const ChatBubble = ({ role, loading, children, subDescription, buttonText, onClick }: ChatBubbleProps) => (
  <Container role={role}>
    {role === 'bot' && (
      <Avatar>
        <Image src='/image/chatbot.png' alt='chatbot' width={30} height={30} />
      </Avatar>
    )}
    <BubbleWrapper>
      <NameText role={role}>{role === 'bot' && '새순'}</NameText>
      <Bubble role={role}>
        {loading ? '잠시만 기다려주세요…' : children}
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
  max-width: 260px; /* Slightly wider to accommodate the subDescription */
`

const NameText = styled.p<{ role: 'bot' | 'user' }>`
  font-size: ${theme.fontSize.xss};
  margin: 0 0 4px 4px;
`

const Bubble = styled.div<{ role: 'bot' | 'user' }>`
  max-width: 235px;
  min-width: 60px;
  padding: 16px 12px;
  line-height: 0.8rem;
  background: ${({ role }) => (role === 'bot' ? '#AFF9BB' : `${theme.colors.lfWhite.base}`)};
  color: ${({ role }) => (role === 'bot' ? '#333333' : `${theme.colors.lfBlack.base}`)};
  justify-content: center;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  white-space: pre-wrap;
  font-size: ${theme.fontSize.xss};
  font-weight: ${theme.fontWeight.semiBold};
  box-shadow: ${theme.shadow.lfPrime};
`

// New styled component for the subDescription
const SubDescription = styled.div<{ role: 'bot' | 'user' }>`
  padding: 10px 0;
  font-size: 8px;
  color: ${theme.colors.lfGreenMain.base};
  text-align: center;
  padding: 10px 8px;
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
