'use client'
import { ReactNode, useState } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { FeedList } from '@/features/challenge/components'

import { getGroupChallengeCategoryList, GroupChallengeCategory } from '@/entities/challenge/api'
import { FilterChallengeCategoryType } from '@/entities/challenge/model'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'
import { responsiveHorizontalPadding } from '@/shared/styles'

interface FeedPageProps {
  className?: string
}

export const FeedPage = ({ className }: FeedPageProps): ReactNode => {
  /** 1. 카테고리 목록 조회 API */
  const { data: categoriesData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.CATEGORIES,
    queryFn: getGroupChallengeCategoryList,
    ...QUERY_OPTIONS.CHALLENGE.GROUP.CATEGORIES,
  })

  // 상수
  const categories: GroupChallengeCategory[] = categoriesData?.data?.categories ?? []

  const [category, setCategory] = useState<FilterChallengeCategoryType>(categories[0]?.category) // 영어

  /** 이벤트 핸들러 */
  /** 카테고리 전환 */
  const handleCategoryRoute = (newCategory: FilterChallengeCategoryType) => {
    setCategory(newCategory)
  }

  return (
    <Wrapper className={className}>
      <TextWrapper>
        <FeedTitle>단체 챌린지 인증 피드</FeedTitle>
        <FeedSubtitle>* 개인 챌린지 미포함</FeedSubtitle>
      </TextWrapper>

      <CategoryGrid>
        {categories.map(cat => (
          <CategoryItem
            key={cat.category}
            isActive={cat.category === category}
            onClick={() => handleCategoryRoute(cat.category)}
          >
            <Image src={cat.imageUrl} alt={cat.label} width={30} height={30} />
            <CategoryLabel>{cat.label}</CategoryLabel>
          </CategoryItem>
        ))}
      </CategoryGrid>

      <FeedList category={category} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
`

const CategoryGrid = styled.div`
  ${responsiveHorizontalPadding};

  margin-top: 8px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(9, 1fr);
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const CategoryItem = styled.div<{ isActive: boolean }>`
  aspect-ratio: 1/1;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;

  background-color: ${({ isActive }) => (isActive ? '#f5eee4' : 'transparent')};

  &:hover {
    background-color: #f5eee4;
  }
`

const CategoryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const FeedTitle = styled.div`
  ${responsiveHorizontalPadding};
  padding-bottom: 10px;

  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const FeedSubtitle = styled.div`
  ${responsiveHorizontalPadding};

  color: ${({ theme }) => theme.colors.lfGreenMain.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`
