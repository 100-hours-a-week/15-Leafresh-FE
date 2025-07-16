'use client'
import { useState } from 'react'

import { usePathname } from 'next/navigation'

import { sendGAEvent } from '@next/third-parties/google'

import { GCS_BUCKET, URL } from '@/shared/constants'
import { useScrollLock, useToggle } from '@/shared/hooks'

import { ChatWindow } from '../chat-window'

import * as S from './styles'

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
        <S.StyledImage
          src={`https://storage.googleapis.com/${GCS_BUCKET}/init/chatbot/chatbot.svg`}
          alt='챗봇 아이콘'
          width={48}
          height={48}
          onClick={handleClickLauncher}
        />
      )}
      {isOpen && <S.Backdrop onClick={handleCloseAndReset} />}
      <ChatWindow key={resetCount} open={isOpen} onClose={() => setOpen(false)} />
    </>
  )
}
