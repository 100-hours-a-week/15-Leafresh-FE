import Image from 'next/image'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

interface ChatHeaderProps {
  close: () => void
}

const ChatHeader = ({ close }: ChatHeaderProps): ReactNode => {
  return (
    <HeaderWrapper>
      <IconWrapper>
        <Image src='/image/chatbot/chatbot_bubble.png' alt='챗봇' width={36} height={36} />
        수피
      </IconWrapper>
      <CloseButton onClick={close}>
        <LucideIcon name='X' size={20} color='lfDarkGray' />
      </CloseButton>
    </HeaderWrapper>
  )
}

export default ChatHeader

const HeaderWrapper = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: #f5fff2;
  border-bottom: solid 1px ${theme.colors.lfBlack.base};
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`
const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`
