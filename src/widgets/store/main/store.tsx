'use client'

import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { ProductList, TimeDealList } from '@/features/store/components'

import { getMemberLeafCount } from '@/entities/member/api'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { useUserStore } from '@/shared/context'

import * as S from './styles'

type TabState = 'time-deal' | 'product'

export const StorePage = () => {
  const { isLoggedIn } = useUserStore()

  const [tab, setTab] = useState<TabState>('time-deal')
  const tabIndex = tab === 'time-deal' ? 0 : 1

  // 보유 나뭇잎 수 조회
  const { data: memberLeafCountData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.LEAVES,
    queryFn: getMemberLeafCount,
    ...QUERY_OPTIONS.MEMBER.LEAVES,
    enabled: isLoggedIn,
  })

  const memberLeafCount = memberLeafCountData?.data.currentLeafPoints

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

      {tab === 'time-deal' ? (
        <TimeDealList memberLeafCount={memberLeafCount} />
      ) : (
        <ProductList memberLeafCount={memberLeafCount} />
      )}
    </S.Container>
  )
}
