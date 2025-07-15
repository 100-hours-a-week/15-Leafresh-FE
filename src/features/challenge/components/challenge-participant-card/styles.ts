import Image from 'next/image'

import styled from '@emotion/styled'

import { LucideIcon } from '@/shared/components'

export const CardContainer = styled.div`
  width: 100%;
  height: 130px;
  margin: 0 0 20px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  cursor: pointer;
`

export const LeftSection = styled.div`
  height: 100%;
  aspect-ratio: 1/1;
  /* background-color: ${({ theme }) => theme.colors.lfGreenMain.base}; */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ChallengeImage = styled(Image)`
  object-fit: cover;
  transition: filter 0.2s ease;

  ${CardContainer}:hover & {
    filter: brightness(1.1);
  }
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
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  margin: 0;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; /* 한 줄로 제한 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
`

export const ArrowIcon = styled(LucideIcon)`
  color: ${({ theme }) => theme.colors.lfBlack.base};
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
  margin-bottom: 10px;
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

export const RateWrapper = styled.div`
  flex: 1;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
`

export const SegmentedBar = styled.div`
  display: flex;
  width: 100%;
  height: 13px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
`

export const Segment = styled.div<{ color: string; hasBorder: boolean }>`
  flex: 1;
  background-color: ${({ color }) => color};
  ${({ hasBorder }) => (hasBorder ? `border-left: 1px solid white;` : '')}
  transition: background-color 0.3s ease;
`

export const SuccessRate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`
