'use client'

import { ReactNode } from 'react'

import { useQuery } from '@tanstack/react-query'

import { OngoingTimeDealList, UpcomingTimeDealList } from '@/features/store/components'

import { getTimeDealProducts, TimeDealProduct } from '@/entities/store/api'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

import * as S from './styles'

interface TimeDealListProps {
  memberLeafCount?: number
  className?: string
}

export const TimeDealList = ({ memberLeafCount, className }: TimeDealListProps): ReactNode => {
  // 타임딜 상품 목록 조회
  const { data: timeDealData } = useQuery({
    queryKey: QUERY_KEYS.STORE.TIME_DEAL.LIST,
    queryFn: getTimeDealProducts,
    ...QUERY_OPTIONS.STORE.TIME_DEAL.LIST,
  })

  const timeDealProducts: TimeDealProduct[] = timeDealData?.data?.timeDeals ?? []

  const ongoing = timeDealProducts.filter(item => item.timeDealStatus === 'ONGOING') /** 현재 타임딜 진행중인 상품 */
  const upcoming = timeDealProducts.filter(item => item.timeDealStatus === 'UPCOMING') /** 다가오는 타임딜 상품 */

  return (
    <S.Container className={className}>
      <OngoingTimeDealList ongoingData={ongoing} memberLeafCount={memberLeafCount} />
      <UpcomingTimeDealList data={upcoming} />
    </S.Container>
  )
}
