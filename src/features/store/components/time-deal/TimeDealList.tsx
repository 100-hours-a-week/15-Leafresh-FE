'use client'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

import { getTimeDealProducts, TimeDealProduct } from '../../api/get-timedeals'
import OngoingTimeDealCard from './OngoingTimeDealCard'
import UpcomingTimeDealCard from './UpcomingTimeDealCard'

const dummyTimeDealProducts: TimeDealProduct[] = []

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
      <UpcomingTimeDealCard data={upcoming} />
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
