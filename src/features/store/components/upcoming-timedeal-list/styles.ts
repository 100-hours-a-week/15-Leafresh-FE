import Image from 'next/image'

import styled from '@emotion/styled'

import { ApologizeContent } from '@/shared/components'
import { media } from '@/shared/config'

export const CarouselWrapper = styled.div`
  overflow: hidden;
  margin-top: 16px;
`

export const UpcomingSection = styled.section`
  margin-top: 24px;
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

export const UpcomingImageBox = styled.div`
  width: 100%;

  position: relative;
  border-top-right-radius: ${({ theme }) => theme.radius.md};
  border-top-left-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  aspect-ratio: 1/1;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    border-radius: ${({ theme }) => theme.radius.md};
  }
`

export const UpcomingDateText = styled.div`
  width: max-content;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.sm};

  z-index: 2;

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
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

export const CarouselInner = styled.div`
  display: flex;
`

export const CarouselSlide = styled.div`
  flex: 0 0 65%;
  margin-right: 16px;

  cursor: pointer;
`

export const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`

export const StyledApologizeContent = styled(ApologizeContent)`
  margin: 24px 0;
`
