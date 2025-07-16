'use client'

import { ReactNode } from 'react'

import { LeafIcon } from '@/shared/assets'

import * as S from './styles'

interface LeafRewardProps {
  reward: number
  className?: string
}

export const LeafReward = ({ reward, className }: LeafRewardProps): ReactNode => {
  return (
    <S.LeafWrapper className={className}>
      <LeafIcon width={24} height={24} />
      <S.LeafLabel>{reward}</S.LeafLabel>
    </S.LeafWrapper>
  )
}
