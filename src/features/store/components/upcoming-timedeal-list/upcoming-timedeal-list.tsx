'use client'

import { ReactNode, useRef } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'
import { format } from 'date-fns'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { TimeDealProduct } from '@/entities/store/api'

import { ApologizeContent } from '@/shared/components'
import { media, theme } from '@/shared/config'

interface UpcomingTimeDealListProps {
  data: TimeDealProduct[]
  className?: string
}

export const UpcomingTimeDealList = ({ data, className }: UpcomingTimeDealListProps): ReactNode => {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current])

  let content
  /** 다가오는 특가 상품이 없는 경우 */
  if (data.length === 0) {
    content = (
      <StyledApologizeContent
        title='예정된 특가 상품이 없습니다'
        description='빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다'
      />
    )
  } else {
    /** 다가오는 특가 상품이 있는 경우 */
    content = (
      <CarouselWrapper ref={emblaRef}>
        <CarouselInner>
          {data.map(item => (
            <CarouselSlide key={item.dealId}>
              <UpcomingImageBox>
                <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                <UpcomingDateText>{format(new Date(item.dealStartTime), 'M월 d일 HH:mm')} 오픈</UpcomingDateText>
              </UpcomingImageBox>
              <DescriptionSection>
                <Title>{item.title}</Title>
                <Description>{item.description}</Description>
                <PriceRow>
                  <Discount>{item.discountedPercentage}%</Discount>
                  <Price>
                    <LeafIcon src='/icon/leaf.svg' alt='leaf' width={24} height={24} /> {item.discountedPrice}
                  </Price>
                  <Origin>{item.defaultPrice}</Origin>
                </PriceRow>
              </DescriptionSection>
            </CarouselSlide>
          ))}
        </CarouselInner>
      </CarouselWrapper>
    )
  }

  return (
    <UpcomingSection>
      <SectionTitle>다가오는 특가 상품</SectionTitle>
      <SubText>놓치면 후회할 가격!</SubText>
      {content}
    </UpcomingSection>
  )
}

const CarouselWrapper = styled.div`
  overflow: hidden;
  margin-top: 16px;
`

const UpcomingSection = styled.section`
  margin-top: 24px;
`

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`

const SubText = styled.p`
  margin: 8px 0px;
  color: ${theme.colors.lfDarkGray.base};
  font-size: ${theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`

const UpcomingImageBox = styled.div`
  width: 100%;

  position: relative;
  border-top-right-radius: ${theme.radius.md};
  border-top-left-radius: ${theme.radius.md};
  overflow: hidden;
  aspect-ratio: 1/1;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
    border-radius: ${theme.radius.md};
  }
`

const UpcomingDateText = styled.div`
  width: max-content;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.sm};

  z-index: 2;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.lg};
  }
`

const DescriptionSection = styled.div`
  padding: 10px 14px;
`

const Title = styled.h3`
  padding: 4px 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.bold};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.lg};
  }
`

const Description = styled.p`
  font-size: ${theme.fontSize.sm};
  margin: 8px 0;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
    margin: 12px 0;
  }
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`

const Discount = styled.span`
  color: #ff7043;
  font-weight: ${theme.fontWeight.bold};
`

const Price = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};

  display: flex;
  align-items: center;
  gap: 3px;
`

const Origin = styled.del`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfGray.base};
`

const CarouselInner = styled.div`
  display: flex;
`

const CarouselSlide = styled.div`
  flex: 0 0 65%;
  margin-right: 16px;

  cursor: pointer;
`

const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`

const StyledApologizeContent = styled(ApologizeContent)`
  margin: 24px 0;
`
