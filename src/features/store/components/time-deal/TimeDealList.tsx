'use client'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { responsiveHorizontalPadding } from '@shared/styles/responsive-style'

import { getTimeDealProducts, TimeDealProduct } from '../../../../entities/store/api/timedeal/get-timedeal-list'
import OngoingTimeDealList from './OngoingTimeDealList'
import UpcomingTimeDealList from './UpcomingTimeDealList'

interface TimeDealListProps {
  className?: string
}

const TimeDealList = ({ className }: TimeDealListProps): ReactNode => {
  // 타임딜 상품 목록 조회
  const { data: timeDealData } = useQuery({
    queryKey: QUERY_KEYS.STORE.TIME_DEAL.LIST,
    queryFn: getTimeDealProducts,
    ...QUERY_OPTIONS.STORE.TIME_DEAL.LIST,
  })

  const timeDealProducts: TimeDealProduct[] = timeDealData?.data?.timeDeals ?? []
  // const timeDealProducts: TimeDealProduct[] = dummyTimeDealProducts

  const ongoing = timeDealProducts.filter(item => item.timeDealStatus === 'ONGOING') /** 현재 타임딜 진행중인 상품 */
  const upcoming = timeDealProducts.filter(item => item.timeDealStatus === 'UPCOMING') /** 다가오는 타임딜 상품 */

  return (
    <Container className={className}>
      <OngoingTimeDealList data={ongoing} />
      <UpcomingTimeDealList data={upcoming} />
    </Container>
  )
}

export default TimeDealList

const Container = styled.div`
  ${responsiveHorizontalPadding};

  /* padding-bottom: 40px; */

  display: flex;
  flex-direction: column;
  gap: 20px;
`

// const dummyTimeDealProducts: TimeDealProduct[] = [
//   {
//     dealId: 99,
//     productId: 100,
//     title: '특가 텀블러1',
//     description: '지금만 이 가격! 텀블러 특가전',
//     imageUrl: '/image/Main_1.png',
//     defaultPrice: 6000,
//     discountedPrice: 4000,
//     discountedPercentage: 30,
//     stock: 10,
//     dealStartTime: new Date().toISOString() as ISOFormatString,
//     dealEndTime: new Date(Date.now() + 1000 * 12).toISOString() as ISOFormatString,
//     timeDealStatus: 'ONGOING',
//   },
//   {
//     dealId: 100,
//     productId: 1,
//     title: '특가 텀블러2',
//     description: '지금만 이 가격! 텀블러 특가전',
//     imageUrl: '/image/Main_1.png',
//     defaultPrice: 6000,
//     discountedPrice: 4000,
//     discountedPercentage: 30,
//     stock: 10,
//     dealStartTime: new Date().toISOString() as ISOFormatString,
//     dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
//     timeDealStatus: 'ONGOING',
//   },

//   {
//     dealId: 101,
//     productId: 2,
//     title: '특가 텀블러',
//     description: '지금만 이 가격! 텀블러 특가전',
//     imageUrl: '/image/Main_1.png',
//     defaultPrice: 6000,
//     discountedPrice: 4000,
//     discountedPercentage: 30,
//     stock: 10,
//     dealStartTime: new Date().toISOString() as ISOFormatString,
//     dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
//     timeDealStatus: 'UPCOMING',
//   },
//   {
//     dealId: 102,
//     productId: 3,
//     title: '특가 텀블러',
//     description: '지금만 이 가격! 텀블러 특가전',
//     imageUrl: '/image/Main_1.png',
//     defaultPrice: 6000,
//     discountedPrice: 4000,
//     discountedPercentage: 30,
//     stock: 10,
//     dealStartTime: new Date().toISOString() as ISOFormatString,
//     dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
//     timeDealStatus: 'UPCOMING',
//   },
//   {
//     dealId: 103,
//     productId: 4,
//     title: '특가 텀블러',
//     description: '지금만 이 가격! 텀블러 특가전',
//     imageUrl: '/image/Main_1.png',
//     defaultPrice: 6000,
//     discountedPrice: 4000,
//     discountedPercentage: 30,
//     stock: 10,
//     dealStartTime: new Date().toISOString() as ISOFormatString,
//     dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
//     timeDealStatus: 'UPCOMING',
//   },
//   {
//     dealId: 104,
//     productId: 5,
//     title: '특가 텀블러',
//     description: '지금만 이 가격! 텀블러 특가전',
//     imageUrl: '/image/Main_1.png',
//     defaultPrice: 6000,
//     discountedPrice: 4000,
//     discountedPercentage: 30,
//     stock: 10,
//     dealStartTime: new Date().toISOString() as ISOFormatString,
//     dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
//     timeDealStatus: 'UPCOMING',
//   },
// ]
// const dummyTimeDealProducts: TimeDealProduct[] = []
