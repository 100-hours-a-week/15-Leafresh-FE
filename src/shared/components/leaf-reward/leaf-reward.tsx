'use client'

import { ReactNode } from 'react'

import Image from 'next/image'

import LeafIcon from '@public/icon/leaf.svg'

import * as S from './styles'

interface LeafRewardProps {
  reward: number
  className?: string
}

export const LeafReward = ({ reward, className }: LeafRewardProps): ReactNode => {
  return (
    <S.LeafWrapper className={className}>
      <Image src={LeafIcon} alt='나뭇잎 아이콘' width={24} height={24} />
      <S.LeafLabel>{reward}</S.LeafLabel>
    </S.LeafWrapper>
  )
}
