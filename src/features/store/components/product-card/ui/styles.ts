import Image from 'next/image'

import { media } from '@shared/config/style/media'

import styled from '@emotion/styled'

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  cursor: pointer;
`

export const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radius.base};
`

export const Thumbnail = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const TextContent = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
`

export const Title = styled.h3`
  margin: 12px 0 6px 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  margin-top: 4px;
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 10px 0 8px 0;
`

export const Price = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`

export const StockNotice = styled.div<{ isSoldOut: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ isSoldOut, theme }) => (isSoldOut ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};

  margin-top: 8px;
`

export const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${({ theme }) => theme.colors.lfWhite.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  border: 1px solid ${({ theme }) => theme.colors.lfLightGray.base};
  border-radius: ${({ theme }) => theme.radius.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.base};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.lfInputBackground.base};
  }
`
