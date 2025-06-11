'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Category } from '@entities/member/constant'
import { BadgeData } from '@features/member/api/profile/get-badge'
import { useInfoModalStore } from '@shared/context/modal/InfoModalStore'
import { theme } from '@shared/styles/theme'

import styled from '@emotion/styled'

interface BadgeTabProps {
  categories: Category[]
  badgeData: BadgeData
}

const BadgeTab = ({ categories, badgeData }: BadgeTabProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedCategory = categories[selectedIndex]?.key ?? ''
  const { openInfoModal } = useInfoModalStore()

  function handleBadgeClick(name: string, condition: string) {
    openInfoModal({
      title: name,
      description: `획득조건 : ${condition}`,
    })
  }

  return (
    <Container>
      <TabBar>
        {categories.map((category, idx) => (
          <TabButton key={category.key} isActive={selectedIndex === idx} onClick={() => setSelectedIndex(idx)}>
            <span>{category.name}</span>
          </TabButton>
        ))}
        <UnderlineWrapper tabCount={categories.length}>
          <Underline $index={selectedIndex} />
        </UnderlineWrapper>
      </TabBar>

      <GridWrapper>
        <FadeGrid key={selectedCategory}>
          {badgeData[selectedCategory]?.map(badge => (
            <Item key={badge.id} onClick={() => handleBadgeClick(badge.name, badge.condition)}>
              <BadgeImageWrapper>
                <BadgeImage src={badge.imageUrl} alt={badge.name} width={120} height={120} />
              </BadgeImageWrapper>
              <Name isLocked={badge.isLocked}>{badge.name}</Name>
            </Item>
          ))}
        </FadeGrid>
      </GridWrapper>
    </Container>
  )
}

export default BadgeTab

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const TabBar = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  background: white;
  border-bottom: 1px solid ${theme.colors.lfLightGray.base};
`

const TabButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  flex: 1;
  height: 40px;
  font-size: ${theme.fontSize.sm};
  font-weight: ${({ isActive }) => (isActive ? theme.fontWeight.semiBold : theme.fontWeight.regular)};
  color: ${({ isActive }) => (isActive ? theme.colors.lfGreenMain.base : theme.colors.lfBlack.base)};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
`

const UnderlineWrapper = styled.div<{ tabCount: number }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
`

const Underline = styled.div<{ $index: number }>`
  width: 100%;
  max-width: calc(100% / 5);
  height: 2px;
  background-color: ${theme.colors.lfGreenMain.base};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 0.3s ease;
`

const GridWrapper = styled.div`
  position: relative;
`

const FadeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 24px;
  row-gap: 24px;
  padding: 24px 0;

  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const Item = styled.div`
  width: 100%; // 중요!
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  cursor: pointer;
`

const BadgeImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
`

const BadgeImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`

const Name = styled.span<{ isLocked: boolean }>`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  padding-top: 5px;
  color: ${theme.colors.lfBlack.base};
  text-align: center;
  max-width: 80px;
  line-height: 1.3;
`
