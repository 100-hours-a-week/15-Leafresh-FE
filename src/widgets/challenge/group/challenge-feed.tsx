'use client'
import Image from 'next/image'

import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { ChallengeCategoryType } from '@entities/challenge/type'
import {
  getGroupChallengeCategoryList,
  GroupChallengeCategory,
} from '@features/challenge/api/get-group-challenge-categories'
import { FeedList } from '@features/challenge/components/challenge/group/feed/FeedList'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

interface ChallengeGroupFeedPageProps {
  className?: string
}

export const ChallengeGroupFeedPage = ({ className }: ChallengeGroupFeedPageProps): ReactNode => {
  /** 1. 카테고리 목록 조회 API */
  const { data: categoriesData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.CATEGORIES,
    queryFn: getGroupChallengeCategoryList,
    ...QUERY_OPTIONS.CHALLENGE.GROUP.CATEGORIES,
  })

  // 상수
  const categories: GroupChallengeCategory[] = categoriesData?.data?.categories ?? []

  // TODO: 챌린지 카테고리 종류가 추가되면, 전체 카테고리로 초기값 설정
  const [category, setCategory] = useState<ChallengeCategoryType>(categories[0].category) // 영어

  /** 이벤트 핸들러 */
  /** 카테고리 전환 */
  const handleCategoryRoute = (newCategory: ChallengeCategoryType) => {
    setCategory(newCategory)
  }

  return (
    <Wrapper className={className}>
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
  padding: 0 20px;
  margin-top: 8px;
  display: grid;
  gap: 4px;
  grid-template-columns: repeat(8, 1fr);
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
