'use client'

import React from 'react'

import { LucideIcon, LucideIconProps } from '@/shared/components'
import { theme, ThemeColorType } from '@/shared/config'

import * as S from './styles'

export type VerificationStatus = 'SUCCESS' | 'FAILURE' | 'PENDING_APPROVAL'

interface StatusConfig {
  barColor: string // 헥스코드: styled BottomBar 에 쓰임
  iconName: LucideIconProps['name']
  iconColorKey: ThemeColorType
}

const statusMap: Record<VerificationStatus, StatusConfig> = {
  SUCCESS: {
    barColor: theme.colors.lfGreenMain.base,
    iconName: 'Check',
    iconColorKey: 'lfBlack',
  },
  FAILURE: {
    barColor: theme.colors.lfRed.base,
    iconName: 'X',
    iconColorKey: 'lfBlack',
  },
  PENDING_APPROVAL: {
    barColor: theme.colors.lfGray.base,
    iconName: 'RotateCw',
    iconColorKey: 'lfBlack',
  },
}

export interface VerificationStatusCardProps {
  day: number
  imageUrl: string
  status: VerificationStatus
}

export const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({ day, imageUrl, status }) => {
  const { barColor, iconName, iconColorKey } = statusMap[status]

  return (
    <S.Card>
      <S.ImageWrapper>
        <S.StyledImg src={imageUrl} alt={`${day}일차 인증`} />
        <S.DayLabel>{day}일차</S.DayLabel>
      </S.ImageWrapper>
      <S.BottomBar bg={barColor}>
        <LucideIcon name={iconName} size={20} color={iconColorKey} />
      </S.BottomBar>
    </S.Card>
  )
}
