import Image from 'next/image'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import LeafIcon from '@public/icon/leaf.svg'

interface LeafRewardProps {
  reward: number
  className?: string
}

export const LeafReward = ({ reward, className }: LeafRewardProps): ReactNode => {
  return (
    <LeafWrapper>
      <Image src={LeafIcon} alt='나뭇잎 아이콘' width={24} height={24} />
      <LeafLabel>{reward}</LeafLabel>
    </LeafWrapper>
  )
}

const LeafWrapper = styled.p`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;

  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const LeafLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
`
