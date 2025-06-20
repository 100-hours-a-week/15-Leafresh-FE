'use client'

import Image from 'next/image'
import { ReactNode } from 'react'

import styled from '@emotion/styled'

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
      <Image src='/icon/feedback_button.svg' alt='피드백 남기기 버튼' />
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
`
