import Image from 'next/image'

import { media } from '@shared/styles/emotion/media'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

import styled from '@emotion/styled'

export const Section = styled.section`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;

  &:hover {
    .badge {
      opacity: 1;
    }
  }
`

export const Badge = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 12px 12px;
  background: ${({ theme }) => theme.colors.lfGreenMain.base};
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: opacity 0.3s ease;

  z-index: 10;
`

export const CarouselWrapper = styled.div`
  width: 100%;
  /* height: 160px; */
  aspect-ratio: 5/3;

  position: relative;
  overflow: hidden;
`

export const CarouselInner = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
`
export const EventCard = styled.div`
  margin-right: 8px;
  flex: 0 0 100%;
  height: 100%;

  background: ${({ theme }) => theme.colors.lfInputBackground.base};
  border-radius: ${({ theme }) => theme.radius.base};
  display: flex;
  flex-direction: row;
  position: relative;

  overflow: hidden;
  gap: 12px;

  cursor: pointer;
`

export const EventImage = styled(Image)`
  position: absolute;
  top: 0;
  object-fit: cover;
  object-position: center center;
  border-radius: ${({ theme }) => theme.radius.base};
`
export const EventGradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0.8) 100%);
  border-radius: ${({ theme }) => theme.radius.base};
`

export const EventTitleOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 16px;
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
  pointer-events: none;
`

export const NoneContent = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`

export const CarouselIndicator = styled.div`
  position: absolute;
  bottom: 8px;
  right: 12px;

  background-color: rgba(0, 0, 0, 0.5);
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
`
