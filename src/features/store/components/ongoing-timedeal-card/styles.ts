import styled from '@emotion/styled'

import { media } from '@/shared/config'

export const EmblaSlide = styled.div`
  flex: 0 0 100%;
  padding: 0 12px;
  box-sizing: border-box;
`
export const Card = styled.div`
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  overflow: hidden;
`

export const Timer = styled.div<{ isRunningOut: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  margin: 4px 0;
  color: ${({ isRunningOut, theme }) => (isRunningOut ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};

  display: flex;
  align-items: center;
  gap: 4px;
`
export const ImageBox = styled.div`
  position: relative;
  aspect-ratio: 2/1;
`
export const DescriptionSection = styled.div`
  padding: 10px 14px;
`

export const Title = styled.h3`
  padding: 4px 0;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin: 8px 0;

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.base};
    margin: 12px 0;
  }
`

export const PriceRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`

export const Discount = styled.span`
  color: #ff7043;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const Price = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  display: flex;
  align-items: center;
  gap: 3px;
`

export const Origin = styled.del`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfGray.base};
`

export const Stock = styled.div<{ soldout: boolean }>`
  margin: 8px 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ soldout, theme }) => (soldout ? theme.colors.lfRed.base : theme.colors.lfDarkGray.base)};
`
export const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  cursor: pointer;
`
