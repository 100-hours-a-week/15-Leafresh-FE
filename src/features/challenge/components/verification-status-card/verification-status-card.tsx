'use client'

import React from 'react'

import styled from '@emotion/styled'

import { LucideIcon, LucideIconProps } from '@/shared/components'
import { theme, ThemeColorType } from '@/shared/config'

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
    <Card>
      <ImageWrapper>
        <StyledImg src={imageUrl} alt={`${day}일차 인증`} />
        <DayLabel>{day}일차</DayLabel>
      </ImageWrapper>
      <BottomBar bg={barColor}>
        <LucideIcon name={iconName} size={20} color={iconColorKey} />
      </BottomBar>
    </Card>
  )
}

/* ===== Styled ===== */
const Card = styled.div`
  width: 100%;
  /* aspect-ratio: 1/1; */

  overflow: hidden;

  position: relative;
  display: flex;
  flex-direction: column;

  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lfLightGray.base};
  box-shadow: ${theme.shadow.lfPrime};
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  background: #eee;
`

const StyledImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const DayLabel = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 4px;
  border-radius: ${theme.radius.xs};
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfBlack.base};
`

const BottomBar = styled.div<{ bg: string }>`
  width: 100%;
  height: 28px;

  bottom: 0;
  background: ${({ bg }) => bg};

  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`
