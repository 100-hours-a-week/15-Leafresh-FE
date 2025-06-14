import Image from 'next/image'

import styled from '@emotion/styled'

export const Wrapper = styled.div<{ visible: boolean; hidden: boolean }>`
  z-index: ${({ hidden }) => (hidden ? -1 : 9999)};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;

  user-select: none;
  -webkit-user-drag: none;
  cursor: grab;
`

export const CardContainer = styled.div`
  width: 320px;
  height: 480px;
  transition:
    transform 0.3s ease,
    opacity 0.4s ease;
  pointer-events: auto;
`

export const Card = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  transform-origin: center center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  border-radius: 20px;
  transition: transform 0.8s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  user-select: none;
  -webkit-user-drag: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: #eff8ee;
    z-index: -1;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`

export const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #eff8ee;
  border-radius: 20px;
  padding: 20px;

  &.back {
    transform: rotateY(180deg);
    cursor: grab;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`

/* 상단 프로필 영역 */
export const TopSection = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 30px;
  padding: 15px 0;
`

export const ProfileImageWrapper = styled.div`
  border-radius: ${({ theme }) => theme.radius.full};
  /* overflow: hidden; */
  width: 60px;
  height: 60px;
  padding: 2px;
  flex-shrink: 0;
`

export const ProfileImg = styled(Image)`
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.full};
  width: 60px;
  height: 60px;
`

export const ProfileInfo = styled.div`
  flex: 1;
`

export const Nickname = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  margin-bottom: 10px;
`

export const CompactStats = styled.div`
  display: flex;
  gap: 20px;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

export const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  margin-bottom: 2px;
`

export const StatValue = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`

/* 진행 상황 영역 */
export const ProgressSection = styled.div`
  background: white;
  width: 95%;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 30px 20px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

export const LeafValueWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center;

  gap: 8px;
`

export const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const TreeIcon = styled.div`
  display: flex;
  align-items: center;
`

export const LeafIcon = styled(Image)`
  width: 24px;
  height: 24px;

  object-fit: cover;
`
export const ProgressTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  text-align: center;

  display: flex;
  align-items: center;

  margin-right: 6px;
`

export const ProgressValues = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`

export const LeafStatWrapper = styled.div`
  display: flex;

  color: ${({ theme }) => theme.colors.lfBlack.base};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const SumLeavesStat = styled.span`
  color: #4caf50;
`
export const RemainLeavesStat = styled.span`
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const ProgressBarSection = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap: 20px;
  /* gap: 12px; */
  align-items: center;
`
export const TreeLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  gap: 4px;
`

export const LeftTreeLabel = styled(TreeLabel)`
  justify-self: start;
`

export const RightTreeLabel = styled(TreeLabel)`
  justify-self: end;
`

export const CurrentLabel = styled.span`
  font-size: 12px;

  padding: 0px 3px;
  color: #666;
  min-width: 24px;
`

export const ProgressBar = styled.div`
  grid-column: 1 / 3;
  height: 12px;
  background: #e8f5e8;
  border-radius: 6px;
  overflow: hidden;
`

export const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
  border-radius: 6px;
`

export const NextLabel = styled.span`
  padding: 0 3px;
  font-size: 12px;
  color: #666;
  min-width: 24px;
  text-align: right;
`

/* 뱃지 영역 */
export const BadgeSection = styled.div`
  flex: 1;
  margin-top: 20px;
`

export const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  justify-items: center;
`

export const BadgeItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const BadgeImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export const BadgeName = styled.span`
  font-size: 10px;
  color: #666;
  text-align: center;
  line-height: 1.2;
`

export const NoBadgeMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  text-align: center;
`

export const Badges = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
`
