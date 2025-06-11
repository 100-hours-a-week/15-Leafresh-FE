import Image from 'next/image'
import { ReactNode } from 'react'

import { theme } from '@shared/styles/theme'
import ApologizeImage from '@public/image/apologize_character.svg'

import styled from '@emotion/styled'

interface ApologizeContentProps {
  title: string
  description: string
  className?: string
}

const ApologizeContent = ({ title, description, className }: ApologizeContentProps): ReactNode => {
  return (
    <EmptySection>
      <Image src={ApologizeImage} alt='사죄 이미지' width={140} height={140} />
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
      <EmptyDescription>감사합니다.</EmptyDescription>
    </EmptySection>
  )
}

export default ApologizeContent

const EmptySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
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
