'use client'

import { ReactNode } from 'react'

import { FeedBackIcon } from '@/shared/assets'

import { FEEDBACK_EXTERNAL_URL } from './consts'
import * as S from './styles'

interface FeedBackLinkButtonProps {
  className?: string
}

export const FeedBackLinkButton = ({ className }: FeedBackLinkButtonProps): ReactNode => {
  return (
    <S.LinkWrapper href={FEEDBACK_EXTERNAL_URL} target='_blank' rel='noopener noreferrer' className={className}>
      <FeedBackIcon />
    </S.LinkWrapper>
  )
}
