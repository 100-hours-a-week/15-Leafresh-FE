'use client'

import { useState } from 'react'

import { ProductList, TimeDealList } from '@/features/store/components'
import { media, theme } from '@/shared/config'
import styled from '@emotion/styled'

type TabState = 'time-deal' | 'product'

export const StorePage = () => {
  const [tab, setTab] = useState<TabState>('time-deal')
  const tabIndex = tab === 'time-deal' ? 0 : 1

  return (
    <Container>
      <TabMenu>
        <TabItem active={tab === 'time-deal'} onClick={() => setTab('time-deal')}>
          특가 상품
        </TabItem>
        <TabItem active={tab === 'product'} onClick={() => setTab('product')}>
          일반 상품
        </TabItem>
        <Underline $index={tabIndex} />
      </TabMenu>

      {tab === 'time-deal' ? <TimeDealList /> : <ProductList />}
    </Container>
  )
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TabMenu = styled.div`
  position: relative;
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
  background: none;
  border: none;
  cursor: pointer;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.md};
  }
`

const Underline = styled.div<{ $index: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 2px;
  background-color: ${theme.colors.lfGreenMain.base};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 0.2s ease;
`
