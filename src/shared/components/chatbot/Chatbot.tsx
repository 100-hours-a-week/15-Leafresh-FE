'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import styled from '@emotion/styled'

import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { useToggle } from '@shared/hooks/useToggle/useToggle'
import { theme } from '@shared/styles/theme'

import ChatWindow from './ChatWindow'

const Chatbot = () => {
  const { value: isOpen, toggle: toggleOpen, setValue: setOpen } = useToggle(false)

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

  useScrollLock(isOpen)
  return (
    <>
      {!isOpen && (
        <Launcher onClick={toggleOpen}>
          <Image src='/image/chatbot.png' alt='Leafresh 챗봇' width={48} height={48} />

          <Name>챗봇 새순</Name>
        </Launcher>
      )}
      {isOpen && <Backdrop onClick={toggleOpen} />} {/* ✅ 클릭 시 닫기 */}
      <ChatWindow open={isOpen} onClose={() => setOpen(false)} />
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

  /* 호버 효과 */
  &:hover {
    transform: scale(1.1);
  }

  /* 클릭 효과 */
  &:active {
    transform: scale(0.95);
  }
`
const Name = styled.p`
  font-size: ${theme.fontSize.xs};
`

const Backdrop = styled.div`
  position: fixed;
  inset: 0; // top: 0; bottom: 0; left: 0; right: 0;
  background-color: rgba(0, 0, 0, 0.4); // 반투명
  z-index: 999; // ChatWindow보다 아래, Launcher보다 위
`
