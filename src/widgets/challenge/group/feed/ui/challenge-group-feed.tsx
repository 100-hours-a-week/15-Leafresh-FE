'use client'
import Image from 'next/image'
import { ReactNode, useState } from 'react'

import {
  getGroupChallengeCategoryList,
  GroupChallengeCategory,
} from '@entities/challenge/api/get-group-challenge-categories'
import { ChallengeCategoryType } from '@entities/challenge/model/type'
import { FeedList } from '@features/challenge/components/challenge/group/feed/FeedList'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { ChallengeGroupFeedPageProps } from '../model/types'
import * as S from './styles'

import { useQuery } from '@tanstack/react-query'

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
