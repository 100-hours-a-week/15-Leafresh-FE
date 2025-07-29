'use client'

import { ReactNode } from 'react'

import Image from 'next/image'

import FeedBackIcon from '@public/icon/feedback_button.svg'

import { FEEDBACK_EXTERNAL_URL } from './consts'
import * as S from './styles'

interface FeedBackLinkButtonProps {
  className?: string
}

export const FeedBackLinkButton = ({ className }: FeedBackLinkButtonProps): ReactNode => {
  return (
    <S.LinkWrapper href={FEEDBACK_EXTERNAL_URL} target='_blank' rel='noopener noreferrer' className={className}>
      <Image src={FeedBackIcon} alt='피드백 남기기 버튼' />
    </S.LinkWrapper>
  )
}
