'use client'

import { ReactNode } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'

import FeedBackIcon from '@public/icon/feedback_button.svg'

import { FEEDBACK_EXTERNAL_URL } from './consts'
interface FeedBackLinkButtonProps {
  className?: string
}

export const FeedBackLinkButton = ({ className }: FeedBackLinkButtonProps): ReactNode => {
  return (
    <LinkWrapper href={FEEDBACK_EXTERNAL_URL} target='_blank' rel='noopener noreferrer' className={className}>
      <Image src={FeedBackIcon} alt='피드백 남기기 버튼' />
    </LinkWrapper>
  )
}

const LinkWrapper = styled.a`
  position: fixed;
  right: 30px;
  bottom: 30px;

  @media (max-width: 735px) {
    display: none;
  }

  transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);

  &:hover {
    transform: scale(1.2);
  }
`
