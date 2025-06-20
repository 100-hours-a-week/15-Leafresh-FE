'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'

import { GroupChallengeCategory, GroupChallengeItem } from '@/entities/challenge/api'
import {
  CHALLENGE_CATEGORY_PAIRS,
  ChallengeCategoryType,
  convertLanguage,
  FilterChallengeCategoryType,
} from '@/entities/challenge/model'
import { useInfiniteGroupChallenges } from '@/features/challenge/api'
import { GroupChallenge, GroupChallengeCard } from '@/features/challenge/components'
import { Loading, NoContent } from '@/shared/components'
import { URL } from '@/shared/constants'
import { responsiveHorizontalPadding } from '@/shared/styles'
import styled from '@emotion/styled'

interface GroupChallengeSectionsProps {
  categories: GroupChallengeCategory[]
  className?: string
}

export const GroupChallengeSections = ({ categories, className }: GroupChallengeSectionsProps): ReactNode => {
  const router = useRouter()

  const [category, setCategory] = useState<FilterChallengeCategoryType>(categories[0]?.category) // 영어

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
    contents = <StyledLoading />
  } else if (!groupChallenges || groupChallenges.length === 0) {
    /** 검색값이 없는 경우 */
    let title: string
    if (category === 'ALL') {
      title = `챌린지가 없습니다`
    } else {
      const korCategory = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) as string
      title = `${korCategory}\n 챌린지가 없습니다`
    }
    contents = (
      <StyledNoContent
        title={title}
        buttonText='챌린지 생성하기'
        clickHandler={() => router.push(URL.CHALLENGE.GROUP.CREATE.value(category))} // 해당 카테고리로 생성하러 가기
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
    <Section className={className}>
      <SectionTitle>
        <span>단체 챌린지</span>
        <SearchBar>
          <SearchInput
            ref={searchInputRef}
            type='text'
            inputMode='search'
            placeholder='어떤 챌린지를 찾으세요?'
            onKeyDown={handleSearchEnter}
          />
        </SearchBar>
      </SectionTitle>

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

      <ChallengeList>
        {contents}
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && !isLoading && groupChallenges.length > 0 && (
          <EndMessage>모든 챌린지를 불러왔습니다</EndMessage>
        )}
        <ObserverTrigger ref={observerRef} />
      </ChallengeList>
    </Section>
  )
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`

const SectionTitle = styled.h2`
  ${responsiveHorizontalPadding};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const SearchBar = styled.div`
  padding: 10px 0;
`

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 15px 10px 35px;
  border-radius: 6px;
  border: none;
  background-color: ${({ theme }) => theme.colors.lfInputBackground};
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
`

const CategoryGrid = styled.div`
  padding: 0 20px;
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

const ChallengeList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 16px;
  margin-top: 24px;
`

const ObserverTrigger = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
`

const StyledNoContent = styled(NoContent)`
  margin: 60px 0;
  min-height: 200px;
`

const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

const StyledLoading = styled(Loading)`
  margin: 60px 0;
  min-height: 200px;
`
