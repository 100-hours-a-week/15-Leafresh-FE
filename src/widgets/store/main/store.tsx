'use client'

import { useState } from 'react'

import { ProductList, TimeDealList } from '@/features/store/components'

import * as S from './styles'

type TabState = 'time-deal' | 'product'

export const StorePage = () => {
  const [tab, setTab] = useState<TabState>('time-deal')
  const tabIndex = tab === 'time-deal' ? 0 : 1

  return (
    <S.Container>
      <S.TabMenu>
        <S.TabItem active={tab === 'time-deal'} onClick={() => setTab('time-deal')}>
          특가 상품
        </S.TabItem>
        <S.TabItem active={tab === 'product'} onClick={() => setTab('product')}>
          일반 상품
        </S.TabItem>
        <S.Underline $index={tabIndex} />
      </S.TabMenu>

      {tab === 'time-deal' ? <TimeDealList /> : <ProductList />}
    </S.Container>
  )
}
