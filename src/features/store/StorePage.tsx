'use client'

import { useState } from 'react'
import styled from '@emotion/styled'

import { media } from '@shared/styles/emotion/media'
import { theme } from '@shared/styles/theme'

import ProductList from './components/product/ProductList'
import TimeDealList from './components/time-deal/TimeDealList'

type TabState = 'time-deal' | 'product'

const StorePage = () => {
  const [tab, setTab] = useState<TabState>('time-deal')

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

      {tab === 'time-deal' ? <TimeDealList /> : <ProductList />}
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
  font-weight: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.base};
  color: ${({ active }) => (active ? theme.colors.lfBlack.base : theme.colors.lfDarkGray.base)};
  border-bottom: 2px solid ${({ active }) => (active ? theme.colors.lfGreenMain.base : 'transparent')};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.md};
  }
`
