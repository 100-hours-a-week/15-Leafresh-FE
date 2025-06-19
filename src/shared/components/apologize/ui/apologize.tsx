import Image from 'next/image'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/config/style/theme'
import ApologizeImage from '@public/image/apologize_character.svg'

interface ApologizeContentProps {
  title: string
  description: string
  className?: string
}

export const ApologizeContent = ({ title, description, className }: ApologizeContentProps): ReactNode => {
  return (
    <EmptySection className={className}>
      <Image src={ApologizeImage} alt='사죄 이미지' width={140} height={140} />
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
      <EmptyDescription>감사합니다.</EmptyDescription>
    </EmptySection>
  )
}

const EmptySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const EmptyTitle = styled.div`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
  margin: 16px 0 16px 0;
`

const EmptyDescription = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.lfDarkGray.base};

  margin-top: 6px;
  text-align: center;

  white-space: pre-wrap;
  word-break: break-word;
`
