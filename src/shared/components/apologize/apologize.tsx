'use client'

import { ReactNode } from 'react'

import styled from '@emotion/styled'

import { ApologizeImage } from '@/shared/assets'
import { theme } from '@/shared/config'

interface ApologizeContentProps {
  title: string
  description: string
  className?: string
}

export const ApologizeContent = ({ title, description, className }: ApologizeContentProps): ReactNode => {
  return (
    <EmptySection className={className}>
      <ApologizeImage width={140} />
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
