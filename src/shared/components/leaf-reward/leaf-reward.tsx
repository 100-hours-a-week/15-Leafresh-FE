'use client'

import { ReactNode } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'

import LeafIcon from '@/shared/assets/icon/leaf.svg'

interface LeafRewardProps {
  reward: number
  className?: string
}

export const LeafReward = ({ reward, className }: LeafRewardProps): ReactNode => {
  return (
    <LeafWrapper className={className}>
      <LeafImage width={24} height={24} />
      <LeafLabel>{reward}</LeafLabel>
    </LeafWrapper>
  )
}

const LeafWrapper = styled.p`
  position: absolute;
  z-index: 20;

  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const LeafImage = styled(LeafIcon)`
  width: 24px;
  height: 24px;
`

const LeafLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
