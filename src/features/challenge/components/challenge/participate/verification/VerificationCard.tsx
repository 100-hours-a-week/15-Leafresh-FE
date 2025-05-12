// src/shared/components/Verification/VerificationImageCard.tsx
'use client'

import React from 'react'
import styled from '@emotion/styled'

import LucideIcon, { LucideIconProps } from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import { ThemeColorType } from '@shared/styles/theme/type'

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

export interface VerificationImageCardProps {
  day: number
  imageUrl: string
  status: VerificationStatus
}

const VerificationImageCard: React.FC<VerificationImageCardProps> = ({ day, imageUrl, status }) => {
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

export default VerificationImageCard

/* ===== Styled ===== */
const Card = styled.div`
  width: 150px;
  height: 140px;
  border-radius: ${theme.radius.sm};
  overflow: hidden;
  background: ${theme.colors.lfLightGray.base};
  box-shadow: ${theme.shadow.lfPrime};
  display: flex;
  flex-direction: column;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 115px;
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
  height: 28px;
  background: ${({ bg }) => bg};
  display: flex;
  align-items: center;
  justify-content: center;
`
