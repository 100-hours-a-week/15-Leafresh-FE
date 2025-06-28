'use client'

import { useState } from 'react'

import { BadgeData } from '@/entities/member/api'
import { Category } from '@/entities/member/model'

import { useInfoModalStore } from '@/shared/context'

import * as S from './styles'
interface BadgeTabProps {
  categories: Category[]
  badgeData: BadgeData
}

export const BadgeTab = ({ categories, badgeData }: BadgeTabProps) => {
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
    <S.Container>
      <S.TabBar>
        {categories.map((category, idx) => (
          <S.TabButton key={category.key} isActive={selectedIndex === idx} onClick={() => setSelectedIndex(idx)}>
            <span>{category.name}</span>
          </S.TabButton>
        ))}
        <S.UnderlineWrapper tabCount={categories.length}>
          <S.Underline $index={selectedIndex} />
        </S.UnderlineWrapper>
      </S.TabBar>

      <S.GridWrapper>
        <S.FadeGrid key={selectedCategory}>
          {badgeData[selectedCategory]?.map(badge => (
            <S.Item key={badge.id} onClick={() => handleBadgeClick(badge.name, badge.condition)}>
              <S.BadgeImageWrapper>
                <S.BadgeImage src={badge.imageUrl} alt={badge.name} width={120} height={120} />
              </S.BadgeImageWrapper>
              <S.Name isLocked={badge.isLocked}>{badge.name}</S.Name>
            </S.Item>
          ))}
        </S.FadeGrid>
      </S.GridWrapper>
    </S.Container>
  )
}
