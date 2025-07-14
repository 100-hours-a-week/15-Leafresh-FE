'use client'

import { ReactNode } from 'react'

import styled from '@emotion/styled'

import FeedBackIcon from '@/shared/assets/icon/feedback_button.svg'
interface FeedBackButtonProps {
  className?: string
}

export const FeedBackButton = ({ className }: FeedBackButtonProps): ReactNode => {
  return (
    <LinkWrapper
      href='https://forms.gle/7Ht67xvKfePwwyyU7' // 👉 실제 피드백 URL로 변경
      target='_blank'
      rel='noopener noreferrer'
      className={className}
    >
      <FeedBackIcon />
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
