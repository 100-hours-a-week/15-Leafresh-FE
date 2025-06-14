'use client'
import React from 'react'

import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

import { StatusConfig, VerificationStatus, VerificationStatusCardProps } from '../model/types'
import * as S from './styles'

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

const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({ day, imageUrl, status }) => {
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

export default VerificationStatusCard
