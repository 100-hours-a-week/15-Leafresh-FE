import Image from 'next/image'
import { ReactNode } from 'react'

import LucideIcon from '@shared/lib/ui/LucideIcon'

import * as S from './styles'

interface ChatHeaderProps {
  close: () => void
}

export const ChatHeader = ({ close }: ChatHeaderProps): ReactNode => {
  return (
    <S.HeaderWrapper>
      <S.IconWrapper>
        <Image src='/image/chatbot/chatbot_bubble.png' alt='챗봇' width={36} height={36} />
        수피
      </S.IconWrapper>
      <S.CloseButton onClick={close}>
        <LucideIcon name='X' size={20} color='lfDarkGray' />
      </S.CloseButton>
    </S.HeaderWrapper>
  )
}
