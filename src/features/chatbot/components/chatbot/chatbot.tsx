'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { ChatWindow } from '../chat-window'

import { URL } from '@/shared/constants'
import { useScrollLock, useToggle } from '@/shared/hooks'
import styled from '@emotion/styled'
import { sendGAEvent } from '@next/third-parties/google'

export const Chatbot = () => {
  const pathname = usePathname()

  const { value: isOpen, setValue: setOpen } = useToggle(false)
  const [resetCount, setResetCount] = useState<number>(0)

  const handleCloseAndReset = () => {
    setResetCount(prev => prev + 1)
    sessionStorage.removeItem('chatSelections')
    setOpen(false)
  }

  useScrollLock(isOpen)

  const handleClickLauncher = () => {
    sendGAEvent('event', 'chatbot', { value: 'chatbot-entered' })
    setOpen(true)
  }

  // TODO: 피드 페이지 생성되면 넣기
  if (pathname !== URL.MAIN.INDEX.value && !pathname.startsWith('/feed')) return null

  return (
    <>
      {!isOpen && (
        <StyledImage
          src='/image/chatbot/chatbot.svg'
          alt='챗봇 아이콘'
          width={48}
          height={48}
          onClick={handleClickLauncher}
        />
      )}
      {isOpen && <Backdrop onClick={handleCloseAndReset} />}
      <ChatWindow key={resetCount} open={isOpen} onClose={() => setOpen(false)} />
    </>
  )
}

const StyledImage = styled(Image)`
  position: absolute;
  bottom: 90px;
  margin-left: auto;
  right: 16px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;

  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`
