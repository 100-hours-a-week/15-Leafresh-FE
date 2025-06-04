'use client'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ISOFormatString } from '@shared/types/date'

import { getTimeDealProducts, TimeDealProduct } from '../../api/get-timedeals'
import OngoingTimeDealCard from './OngoingTimeDealCard'
import UpcomingTimeDealCard from './UpcomingTimeDealCard'

const dummyTimeDealProducts: TimeDealProduct[] = [
  {
    dealId: 99,
    productId: 100,
    title: '특가 텀블러1',
    description: '지금만 이 가격! 텀블러 특가전',
    imageUrl: '/image/Main_1.png',
    defaultPrice: 6000,
    discountedPrice: 4000,
    discountedPercentage: 30,
    stock: 10,
    dealStartTime: new Date().toISOString() as ISOFormatString,
    dealEndTime: new Date(Date.now() + 1000 * 12).toISOString() as ISOFormatString,
    timeDealStatus: 'ONGOING',
  },
  {
    dealId: 100,
    productId: 1,
    title: '특가 텀블러2',
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

  const ongoing = timeDealProducts.filter(item => item.timeDealStatus === 'ONGOING') /** 현재 타임딜 진행중인 상품 */
  const upcoming = timeDealProducts.filter(item => item.timeDealStatus === 'UPCOMING') /** 다가오는 타임딜 상품 */

  return (
    <Container>
      <OngoingTimeDealCard data={ongoing} />
      <UpcomingTimeDealCard data={upcoming} />
    </Container>
  )
}

export default TimeDealList

const Container = styled.div`
  padding-bottom: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`
