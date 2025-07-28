'use client'
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useInfiniteGroupChallenges } from '@/features/challenge/api'
import { GroupChallenge, GroupChallengeCard } from '@/features/challenge/components'

import { GroupChallengeCategory, GroupChallengeItem } from '@/entities/challenge/api'
import { CHALLENGE_CATEGORY_PAIRS, convertLanguage, FilterChallengeCategoryType } from '@/entities/challenge/model'

import { Loading } from '@/shared/components'
import { URL } from '@/shared/constants'

import * as S from './styles'

interface GroupChallengeSectionsProps {
  categories: GroupChallengeCategory[]
  className?: string
}

export const GroupChallengeSections = ({ categories, className }: GroupChallengeSectionsProps): ReactNode => {
  const router = useRouter()

  const [category, setCategory] = useState<FilterChallengeCategoryType>() // 영어

  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0].category)
    }
  }, [categories, category])

  const [input, setInput] = useState('') // 유저의 검색값
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteGroupChallenges(
    category,
    input,
  )

  const observerRef = useRef<HTMLDivElement | null>(null)

  /** 무한스크롤 */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.6,
      },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  /** 카테고리 전환 */
  const handleCategoryRoute = (newCategory: FilterChallengeCategoryType) => {
    setCategory(newCategory)
    setInput('') // 검색값 초기화
    if (searchInputRef.current) searchInputRef.current.value = ''
  }

  /** 엔터로 검색 확정 */
  const handleSearchEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = searchInputRef.current?.value.trim() || ''
      setInput(keyword)
    }
  }

  let contents
  const groupChallenges: GroupChallengeItem[] = data?.pages.flatMap(page => page.data.groupChallenges ?? []) ?? []
  if (isLoading) {
    contents = <S.StyledLoading />
  } else if (!groupChallenges || groupChallenges.length === 0) {
    /** 검색값이 없는 경우 */
    let title: string

    const isSearching: boolean = input.trim().length > 0

    if (isSearching) {
      title = '검색 결과가 없습니다'
    } else if (category === 'ALL' || !category) {
      title = `챌린지가 없습니다`
    } else {
      const korCategory = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) as string
      title = `${korCategory}\n 챌린지가 없습니다`
    }
    contents = (
      <S.StyledNoContentFeedback
        title={title}
        buttonText='챌린지 생성하기'
        clickHandler={() => {
          router.push(URL.CHALLENGE.GROUP.CREATE.value(category === 'ALL' ? undefined : category))
        }} // 해당 카테고리로 생성하러 가기
      />
    )
  } else {
    /** 검색값이 있는 경우 */
    contents = groupChallenges.map(challenge => {
      const {
        id,
        title,
        category,
        description,
        leafReward,
        currentParticipantCount,
        endDate,
        startDate,
        remainingDay,
        thumbnailUrl,
      } = challenge
      const data: GroupChallenge = {
        id,
        name: title,
        description,
        startDate,
        endDate,
        category,
        currentParticipantCount,
        imageUrl: thumbnailUrl,
        leafReward,
      }

      return <GroupChallengeCard key={id} data={data} isAuth={false} />
    })
  }

  return (
    <S.Section className={className}>
      <S.SectionTitle>
        <span>단체 챌린지</span>
        <S.SearchBar>
          <S.SearchInput
            ref={searchInputRef}
            type='text'
            inputMode='search'
            placeholder='어떤 챌린지를 찾으세요?'
            onKeyDown={handleSearchEnter}
          />
        </S.SearchBar>
      </S.SectionTitle>

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

      <S.ChallengeList>
        {contents}
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && !isLoading && groupChallenges.length > 0 && (
          <S.EndMessage>모든 챌린지를 불러왔습니다</S.EndMessage>
        )}
        <S.ObserverTrigger ref={observerRef} />
      </S.ChallengeList>
    </S.Section>
  )
}
