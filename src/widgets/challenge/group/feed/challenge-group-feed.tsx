'use client'
import { ReactNode, useState } from 'react'

import Image from 'next/image'

import { useQuery } from '@tanstack/react-query'

import { FeedList } from '@/features/challenge/components'

import { getGroupChallengeCategoryList, GroupChallengeCategory } from '@/entities/challenge/api'
import { FilterChallengeCategoryType } from '@/entities/challenge/model'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

import * as S from './styles'

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
    <S.Wrapper className={className}>
      <S.CategoryGrid>
        {categories.map(cat => (
          <S.CategoryItem
            key={cat.category}
            isActive={cat.category === category}
            onClick={() => handleCategoryRoute(cat.category)}
          >
            <Image src={cat.imageUrl} alt={cat.label} width={30} height={30} />
            <S.CategoryLabel>{cat.label}</S.CategoryLabel>
          </S.CategoryItem>
        ))}
      </S.CategoryGrid>

      <FeedList category={category} />
    </S.Wrapper>
  )
}
