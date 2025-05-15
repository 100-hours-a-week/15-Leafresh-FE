'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import styled from '@emotion/styled'

import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { useToggle } from '@shared/hooks/useToggle/useToggle'
import { theme } from '@shared/styles/theme'

import ChatWindow from './ChatWindow'

const Chatbot = () => {
  const { value: isOpen, setValue: setOpen } = useToggle(false)
  const [resetCount, setResetCount] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      const windowWidth = window.innerWidth
      const contentWidth = 500 // 컨텐츠의 최대 너비

      // 윈도우 너비가 컨텐츠 너비보다 클 때
      if (windowWidth > contentWidth) {
        // 컨텐츠 영역 안쪽에 위치하도록 계산
        const rightPosition = (windowWidth - contentWidth) / 2 + 24
        document.documentElement.style.setProperty('--launcher-right', `${rightPosition}px`)
      } else {
        document.documentElement.style.setProperty('--launcher-right', '24px')
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  // 닫을 때 초기화까지 포함
  const handleCloseAndReset = () => {
    setResetCount(prev => prev + 1) // ChatWindow 내부 ChatFrame을 초기화시키는 키
    sessionStorage.removeItem('chatSelections') // 혹시 몰라 세션도 지움
    setOpen(false)
  }

  useScrollLock(isOpen)
  return (
    <>
      {!isOpen && (
        <Launcher onClick={() => setOpen(true)}>
          <Image
            src='/image/chatbot.png'
            alt='Leafresh 챗봇'
            width={48}
            height={48}
            style={{
              backgroundColor: `${theme.colors.lfWhite.base}`,
              borderRadius: '9999px',
            }}
          />

          <Name>챗봇 수피</Name>
        </Launcher>
      )}
      {isOpen && <Backdrop onClick={handleCloseAndReset} />}
      <ChatWindow key={resetCount} open={isOpen} onClose={() => setOpen(false)} />
    </>
  )
}
export default Chatbot

const Launcher = styled.button`
  position: fixed;
  flex-direction: column;
  bottom: 24px;
  right: var(--launcher-right, 24px);
  width: 48px;
  height: 48px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`
const Name = styled.p`
  font-size: ${theme.fontSize.xs};
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4); // 반투명
  z-index: 999; // ChatWindow보다 아래, Launcher보다 위
`
