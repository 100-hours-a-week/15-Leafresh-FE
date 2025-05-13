'use client'

import Image from 'next/image'

import styled from '@emotion/styled'

import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { useToggle } from '@shared/hooks/useToggle/useToggle'
import { theme } from '@shared/styles/theme'

import ChatWindow from './ChatWindow'

const Chatbot = () => {
  const { value: isOpen, toggle: toggleOpen, setValue: setOpen } = useToggle(false)

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
  right: 24px;
  width: 48px;
  height: 48px;
  /* box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1); */
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.3s ease;
  @media screen {
  }
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
