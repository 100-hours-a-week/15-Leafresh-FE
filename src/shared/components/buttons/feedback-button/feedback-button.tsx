'use client'

import { ReactNode } from 'react'

import Image from 'next/image'

import FeedBackIcon from '@public/icon/feedback_button.svg'

import * as S from './styles'

interface FeedBackButtonProps {
  className?: string
}

export const FeedBackButton = ({ className }: FeedBackButtonProps): ReactNode => {
  return (
    <S.LinkWrapper
      href='https://forms.gle/7Ht67xvKfePwwyyU7' // 👉 실제 피드백 URL로 변경
      target='_blank'
      rel='noopener noreferrer'
      className={className}
    >
      <Image src={FeedBackIcon} alt='피드백 남기기 버튼' />
    </S.LinkWrapper>
  )
}
