'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { getTimeDealProducts, TimeDealProduct } from '@features/store/api/get-timedeals'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { theme } from '@shared/styles/theme'
import { ISOFormatString } from '@shared/types/date'

import ProductList from './components/ProductList'
import TimeDealList from './components/TimeDealList'

const dummyTimeDealProducts: TimeDealProduct[] = [
  {
    dealId: 100,
    productId: 1,
    title: '특가 텀블러',
    description: '지금만 이 가격! 텀블러 특가전',
    imageUrl: '/image/sample_product.png',
    defaultPrice: 6000,
    discountedPrice: 4000,
    discountedPercentage: 30,
    stock: 10,
    dealStartTime: new Date().toISOString() as ISOFormatString,
    dealEndTime: new Date(Date.now() + 1000 * 60 * 60).toISOString() as ISOFormatString,
    timeDealStatus: 'UPCOMING',
  },
]

type TabState = 'time-deal' | 'product'

const StorePage = () => {
  const [tab, setTab] = useState<TabState>('product')

  // 타임딜 상품 목록 조회
  const { data: timeDealData } = useQuery({
    queryKey: QUERY_KEYS.STORE.TIME_DEAL.LIST,
    queryFn: getTimeDealProducts,
    ...QUERY_OPTIONS.STORE.TIME_DEAL.LIST,
    enabled: false, // TODO: API 추가하면서 삭제 필요
  })

  // const timeDealProducts: TimeDealProduct[] = timeDealData?.data.timeDeals ?? []
  const timeDealProducts: TimeDealProduct[] = dummyTimeDealProducts

  return (
    <Container>
      <TabMenu>
        <TabItem active={tab === 'time-deal'} onClick={() => setTab('time-deal')}>
          특가 상품
        </TabItem>
        <TabItem active={tab === 'product'} onClick={() => setTab('product')}>
          일반 상품
        </TabItem>
      </TabMenu>

      {tab === 'product' ? <ProductList /> : <TimeDealList />}
    </Container>
  )
}

export default StorePage

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TabMenu = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ccc;
`

const TabItem = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 16px;
  text-align: center;
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.md};
  color: ${({ active }) => (active ? theme.colors.lfBlack.base : theme.colors.lfDarkGray.base)};
  border-bottom: 2px solid ${({ active }) => (active ? theme.colors.lfGreenMain.base : 'transparent')};
`
