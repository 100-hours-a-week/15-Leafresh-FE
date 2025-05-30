'use client'
import React, { useState } from 'react'
import styled from '@emotion/styled'
import Image from 'next/image'
import { theme } from '@shared/styles/theme'
import { BadgeData } from '@features/member/api/profile/get-badge'
import { Category } from '@entities/member/constant'
import { useInfoModalStore } from '@shared/context/modal/InfoModalStore'

interface BadgeTabProps {
  categories: Category[]
  badgeData: BadgeData
}

const BadgeTab = ({ categories, badgeData }: BadgeTabProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedCategory = categories[selectedIndex]?.key ?? ''
  const { openInfoModal, isOpen: isInfoModalOpen } = useInfoModalStore()

  function handleBadgeClick(name: string, condition: string, isLocked: boolean) {
    openInfoModal({
      title: isLocked ? '???' : name,
      description: condition,
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
        {categories.map(category => (
          <Grid key={category.key} isVisible={selectedCategory === category.key}>
            {badgeData[category.key]?.map(badge => (
              <Item key={badge.id} onClick={() => handleBadgeClick(badge.name, badge.condition, badge.isLocked)}>
                <BadgeImage src={badge.imageUrl} alt={badge.name} width={60} height={60} />
                <Name isLocked={badge.isLocked}>{badge.isLocked ? '???' : `${badge.name}`}</Name>
                {badge.isLocked && <Lock>🔒</Lock>}
              </Item>
            ))}
          </Grid>
        ))}
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
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid ${theme.colors.lfLightGray.base};
`

const TabButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  flex: 1;
  height: 40px;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semiBold};
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
  left: 20px;
  width: calc(100% - 40px); // 양쪽 padding 제외
  display: flex;
`

const Underline = styled.div<{ $index: number }>`
  width: 100%;
  max-width: calc(100% / 5); // 탭 개수만큼 나누기
  height: 2px;
  background-color: ${theme.colors.lfGreenMain.base};
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 0.3s ease;
`

const GridWrapper = styled.div`
  position: relative;
`

const Grid = styled.div<{ isVisible: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px 20px;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
`

const BadgeImage = styled(Image)`
  width: 100%;
  max-width: 90px;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
`

const Name = styled.span<{ isLocked: boolean }>`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
  padding-top: 5px;
  color: ${theme.colors.lfBlack.base};
  text-align: center;
  max-width: 80px;
  line-height: 1.3;
`

const Lock = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(25%, -25%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`
