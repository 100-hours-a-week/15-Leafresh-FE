import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { theme } from '@shared/styles/theme'

import LucideIcon from '@shared/lib/ui/LucideIcon'
import Image from 'next/image'

interface ChatHeaderProps {
  close: () => void
}

const ChatHeader = ({ close }: ChatHeaderProps): ReactNode => {
  return (
    <HeaderWrapper>
      <IconWrapper>
        <Image src='/image/chatbot.png' alt='새순' width={36} height={36} />
        새순
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
