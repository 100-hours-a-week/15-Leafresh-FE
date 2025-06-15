'use client'
import { Section } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'

import { GroupChallengeItem } from '@entities/challenge/api/group/get-group-list'
import { ChallengeCategoryType } from '@entities/challenge/model'
import { useInfiniteGroupChallenges } from '@features/challenge/api'
import { GroupChallengeCard } from '@features/challenge/components'
import { GroupChallenge } from '@features/challenge/components/group-challenge-card/model/types'
import Loading from '@shared/components/loading/ui/loading'
import { URL } from '@shared/constants/route/route'

import { GroupChallengeSectionsProps } from '../model/types'
import * as S from './styles'

export const GroupChallengeSections = ({ categories, className }: GroupChallengeSectionsProps): ReactNode => {
  const router = useRouter()

  // TODO: 챌린지 카테고리 종류가 추가되면, 전체 카테고리로 초기값 설정
  const [category, setCategory] = useState<ChallengeCategoryType>(categories[0].category) // 영어
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
  const handleCategoryRoute = (newCategory: ChallengeCategoryType) => {
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
    contents = <Loading />
  } else if (!groupChallenges || groupChallenges.length === 0) {
    /** 검색값이 없는 경우 */
    contents = (
      <S.StyledNoContent
        title='검색 결과가 없습니다'
        buttonText='챌린지 생성하기'
        clickHandler={() => router.push(URL.CHALLENGE.GROUP.CREATE.value(category))} // 해당 카테고리로 생성하러 가기
      />
    )
  } else {
    /** 검색값이 있는 경우 */
    contents = groupChallenges.map(challenge => {
      const { id, title, leafReward, currentParticipantCount, endDate, startDate, remainingDay, thumbnailUrl } =
        challenge
      const data: GroupChallenge = {
        id,
        name: title,
        description: '더미 데이터', //TODO: 백엔드에서 description 데이터 추가해주면 넣기
        startDate,
        endDate,
        category, //TODO: 백엔드에서 description 데이터 추가해주면 넣기
        currentParticipantCount,
        imageUrl: thumbnailUrl,
        leafReward,
      }

      return <GroupChallengeCard key={id} data={data} isAuth={false} />
    })
  }

  return (
    <Section>
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
    </Section>
  )
}
