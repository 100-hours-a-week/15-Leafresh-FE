import { LucideIcon } from '@shared/components'
import { theme } from '@shared/config/style/theme'

import styled from '@emotion/styled'

export const CardContainer = styled.div`
  width: 100%;
  height: 130px;
  border-radius: 15px;
  background-color: ${theme.colors.lfWhite.base};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  //마우스 호버
  &:hover {
    transform: translateY(-2px);
  }
`

export const LeftSection = styled.div`
  width: 130px;
  height: 100%;
  /* background-color: ${theme.colors.lfGreenMain.base}; */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
`

export const ChallengeImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const RightSection = styled.div`
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
`

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`

export const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
`

export const ArrowIcon = styled(LucideIcon)`
  color: #999;
`

export const DateRange = styled.div`
  font-size: 11px;
  color: #666;
  margin-bottom: 8px;
`

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 14px;
`

export const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #666;
`

export const ProgressIcon = styled.span`
  margin-right: 5px;
  font-size: 12px;
`

export const ProgressText = styled.span`
  font-size: 11px;
`

// 프로그레스 바 스타일 추가
export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  position: absolute;
  bottom: 16px;
  left: 12px;
  width: calc(100% - 52px);
`

export const ProgressBarFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #4caf50;
  border-radius: 3px;
  transition: width 0.3s ease;
`

export const SuccessRate = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`
