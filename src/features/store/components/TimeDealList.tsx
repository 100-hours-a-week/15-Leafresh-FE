'use client'
import { format } from 'date-fns'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

import { ReactNode, useRef } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { media } from '@shared/styles/emotion/media'
import { theme } from '@shared/styles/theme'
import { ISOFormatString } from '@shared/types/date'

import { getTimeDealProducts, TimeDealProduct } from '../api/get-timedeals'

const dummyTimeDealProducts: TimeDealProduct[] = [
  {
    dealId: 100,
    productId: 1,
    title: '특가 텀블러',
    description: '지금만 이 가격! 텀블러 특가전',
    imageUrl: '/image/Main_1.png',
    defaultPrice: 6000,
    discountedPrice: 4000,
    discountedPercentage: 30,
    stock: 10,
    dealStartTime: new Date().toISOString() as ISOFormatString,
    dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
    timeDealStatus: 'ONGOING',
  },
  {
    dealId: 101,
    productId: 2,
    title: '특가 텀블러',
    description: '지금만 이 가격! 텀블러 특가전',
    imageUrl: '/image/Main_1.png',
    defaultPrice: 6000,
    discountedPrice: 4000,
    discountedPercentage: 30,
    stock: 10,
    dealStartTime: new Date().toISOString() as ISOFormatString,
    dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
    timeDealStatus: 'UPCOMING',
  },
  {
    dealId: 102,
    productId: 3,
    title: '특가 텀블러',
    description: '지금만 이 가격! 텀블러 특가전',
    imageUrl: '/image/Main_1.png',
    defaultPrice: 6000,
    discountedPrice: 4000,
    discountedPercentage: 30,
    stock: 10,
    dealStartTime: new Date().toISOString() as ISOFormatString,
    dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
    timeDealStatus: 'UPCOMING',
  },
  {
    dealId: 103,
    productId: 4,
    title: '특가 텀블러',
    description: '지금만 이 가격! 텀블러 특가전',
    imageUrl: '/image/Main_1.png',
    defaultPrice: 6000,
    discountedPrice: 4000,
    discountedPercentage: 30,
    stock: 10,
    dealStartTime: new Date().toISOString() as ISOFormatString,
    dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
    timeDealStatus: 'UPCOMING',
  },
  {
    dealId: 104,
    productId: 5,
    title: '특가 텀블러',
    description: '지금만 이 가격! 텀블러 특가전',
    imageUrl: '/image/Main_1.png',
    defaultPrice: 6000,
    discountedPrice: 4000,
    discountedPercentage: 30,
    stock: 10,
    dealStartTime: new Date().toISOString() as ISOFormatString,
    dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
    timeDealStatus: 'UPCOMING',
  },
]

interface TimeDealListProps {
  className?: string
}

const TimeDealList = ({ className }: TimeDealListProps): ReactNode => {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }))
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current])

  // 타임딜 상품 목록 조회
  const { data: timeDealData } = useQuery({
    queryKey: QUERY_KEYS.STORE.TIME_DEAL.LIST,
    queryFn: getTimeDealProducts,
    ...QUERY_OPTIONS.STORE.TIME_DEAL.LIST,
    enabled: false, // TODO: API 추가하면서 삭제 필요
  })

  // TODO: API 붙으면 진짜 데이터로 변경
  // const timeDealProducts: TimeDealProduct[] = timeDealData?.data?.timeDeals ?? []
  const timeDealProducts: TimeDealProduct[] = dummyTimeDealProducts

  const ongoing = timeDealProducts.find(item => item.timeDealStatus === 'ONGOING') /** 현재 타임딜 진행중인 상품 */
  const upcoming = timeDealProducts.filter(item => item.timeDealStatus === 'UPCOMING') /** 다가오는 타임딜 상품 */

  return (
    <Container>
      {ongoing && (
        <OngoingSection>
          <OngoingTitle>🔥 특가 상품</OngoingTitle>
          <SubText>세상은 1등만 기억해!</SubText>
          <Timer>⏰00:45:12</Timer>
          <InfoCard>
            <OngoingImageBox>
              <Image src={ongoing.imageUrl} alt={ongoing.title} fill style={{ objectFit: 'cover' }} />
            </OngoingImageBox>
            <DescriptionSection>
              <Title>{ongoing.title}</Title>
              <Description>{ongoing.description}</Description>
              <PriceBox>
                <Left>
                  <Discount>{ongoing.discountedPercentage}%</Discount>
                  <Price>
                    <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} /> {ongoing.discountedPrice}
                  </Price>
                  <Origin>{ongoing.defaultPrice}</Origin>
                </Left>
                <Stock>남은 재고 {ongoing.stock}개</Stock>
              </PriceBox>
              <BuyButton>구매하기</BuyButton>
            </DescriptionSection>
          </InfoCard>
        </OngoingSection>
      )}

      <UpcomingSection>
        <SectionTitle>다가오는 특가 상품</SectionTitle>
        <SubText>놓치면 후회할 가격!</SubText>
        <CarouselWrapper ref={emblaRef}>
          <CarouselInner>
            {upcoming.map(item => (
              <CarouselSlide key={item.dealId}>
                <UpcomingImageBox>
                  <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  <UpcomingDateText>{format(new Date(item.dealStartTime), 'M월 d일 HH:mm')} 오픈</UpcomingDateText>
                </UpcomingImageBox>
                <DescriptionSection>
                  <Title>{item.title}</Title>
                  <Description>{item.description}</Description>
                  <PriceBox>
                    <Left>
                      <Discount>{item.discountedPercentage}%</Discount>
                      <Price>
                        <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} /> {item.discountedPrice}
                      </Price>
                      <Origin>{item.defaultPrice}</Origin>
                    </Left>
                  </PriceBox>
                </DescriptionSection>
              </CarouselSlide>
            ))}
          </CarouselInner>
        </CarouselWrapper>
      </UpcomingSection>
    </Container>
  )
}

export default TimeDealList

const Container = styled.div`
  padding-top: 20px;
  padding-bottom: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`

const OngoingSection = styled.div`
  margin: 20px 0;
`
const OngoingTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const SubText = styled.p`
  margin: 8px 0px;
  color: ${theme.colors.lfDarkGray.base};
  font-size: ${theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`

const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0;
`

const ImageBox = styled.div`
  width: 100%;

  position: relative;
  border-top-right-radius: ${theme.radius.md};
  border-top-left-radius: ${theme.radius.md};
  overflow: hidden;
`

const OngoingImageBox = styled(ImageBox)`
  aspect-ratio: 2/1;
`

const UpcomingImageBox = styled(ImageBox)`
  aspect-ratio: 1/1;

  position: relative;

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

const InfoCard = styled.div`
  box-shadow: ${theme.shadow.lfInput};
  border-radius: ${theme.radius.sm};

  cursor: pointer;
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

const PriceBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`

const Left = styled.div`
  display: flex;
  align-items: center;
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

const Stock = styled.span`
  font-size: ${theme.fontSize.sm};
`

const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`

const UpcomingSection = styled.section`
  margin-top: 24px;
`

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`

const CarouselWrapper = styled.div`
  overflow: hidden;
  margin-top: 16px;
`

const CarouselInner = styled.div`
  display: flex;
`

const CarouselSlide = styled.div`
  flex: 0 0 60%;
  margin-right: 16px;

  cursor: pointer;
`

const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`
