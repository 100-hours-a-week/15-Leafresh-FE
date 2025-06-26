import Image from 'next/image'

import styled from '@emotion/styled'

import { LeafReward, LucideIcon } from '@/shared/components'
import { responsiveHorizontalPadding } from '@/shared/styles'

export const Section = styled.section`
  display: flex;
  flex-direction: column;
`

export const SectionHeader = styled.div`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const SubDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

export const CarouselWrapper = styled.div`
  position: relative;
  margin-top: 12px;
  width: 100%;
  overflow: hidden;
`

export const EmblaContainer = styled.div`
  width: 100%;
  overflow: hidden;
`

export const EmblaSlideContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
`

export const EmblaSlide = styled.div`
  position: relative;
  flex: 0 0 100%;
  padding: 0 20px;
  box-sizing: border-box;
`

export const DailyCard = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
`

export const DailyImageArea = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  border-top-left-radius: ${({ theme }) => theme.radius.base};
  border-top-right-radius: ${({ theme }) => theme.radius.base};
`

export const DailyImage = styled(Image)`
  object-fit: cover;
`

export const DailyCardDescriptions = styled.div`
  padding: 0 16px;
  margin-top: 12px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const JoinButton = styled.button`
  width: 100%;
  margin: 12px 0;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
`

export const ArrowButton = styled.button<{ direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ direction }) => (direction === 'prev' ? 'left: 8px;' : 'right: 8px;')}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  font-size: 18px;
  cursor: pointer;
  z-index: 10;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

export const IconWrapper = styled.div`
  width: 40px;
  aspect-ratio: 1/1;
  padding: 10;
  position: absolute;
  top: 50%;

  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};

  cursor: pointer;
`

export const LeftIconWrapper = styled(IconWrapper)`
  left: 0;
  transform: translateY(-50%);
`

export const RightIconWrapper = styled(IconWrapper)`
  right: 0;
  transform: translateY(-50%);
`

export const ScrollIcon = styled(LucideIcon)`
  width: 100%;
  height: 100%;
`

export const StyledLeafReward = styled(LeafReward)`
  top: 4%;
  right: 9%;
`
