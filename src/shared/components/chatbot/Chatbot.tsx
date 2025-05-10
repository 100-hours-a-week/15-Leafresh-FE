'use client'

import React from 'react'
import styled from '@emotion/styled'
import Image from 'next/image'
import ChatWindow from './ChatWindow'
import { useToggle } from '@shared/hooks/useToggle/useToggle'

export default function Chatbot() {
  const { value: open, toggle: toggleOpen, setValue: setOpen } = useToggle(false)

  return (
    <>
      {/* 플로팅 버튼 (설계서 1번 항목) */}
      {!open && (
        <Launcher onClick={toggleOpen}>
          <Image src='/image/chatbot.png' alt='Leafresh 챗봇' width={48} height={48} />
        </Launcher>
      )}

      {/* ChatWindow */}
      <ChatWindow open={open} onClose={() => setOpen(false)} />
    </>
  )
}

const Launcher = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
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
