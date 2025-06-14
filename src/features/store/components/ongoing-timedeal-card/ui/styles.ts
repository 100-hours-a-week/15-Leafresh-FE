import { media } from '@shared/styles/emotion/media'

import styled from '@emotion/styled'

export const Container = styled.section`
  margin: 20px 0;
  width: 100%;
  position: relative;
  cursor: pointer;
`
export const TitleBox = styled.div`
  margin-bottom: 12px;
`

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const SubText = styled.p`
  margin: 8px 0px;
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  font-size: ${({ theme }) => theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.base};
  }
`

export const CarouselWrapper = styled.div`
  width: 100%;

  position: relative;
`
export const Embla = styled.div`
  padding: 6px 0;
  overflow: hidden;
`
export const EmblaTrack = styled.div`
  display: flex;
`
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

export const MoveButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  width: 36px;
  height: 36px;
  z-index: 10;

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
  }
`

export const LeftButton = styled(MoveButton)`
  left: 0;
`
export const RightButton = styled(LeftButton)`
  left: auto;
  right: 0;
`
