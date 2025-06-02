'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import { ChallengeCategoryType } from '@entities/challenge/type'
import { GroupChallengeCategory } from '@features/challenge/api/get-group-challenge-categories'
import { GroupChallengeItem } from '@features/challenge/api/get-group-challenge-list'
import {
  GroupChallenge,
  GroupChallengeCard,
} from '@features/challenge/components/common/group-challenge-card/GroupChallengeCard'
import { useInfiniteGroupChallenges } from '@features/challenge/hook/useGroupChallengeList'
import NoContent from '@shared/components/no-content/no-content'
import { URL } from '@shared/constants/route/route'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

interface GroupChallengeSectionsProps {
  categories: GroupChallengeCategory[]
  className?: string
}

export const GroupChallengeSections = ({ categories, className }: GroupChallengeSectionsProps): ReactNode => {
  const router = useRouter()

  const [category, setCategory] = useState<ChallengeCategoryType>(categories[0].category) // 영어
  const [searchKeyword, setSearchKeyword] = useState('') // 유저의 검색값

  const searchInputRef = useRef<HTMLInputElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteGroupChallenges(category, searchKeyword)

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
    setSearchKeyword('')
    if (searchInputRef.current) searchInputRef.current.value = ''
  }

  /** 엔터로 검색 확정 */
  const handleSearchEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = searchInputRef.current?.value.trim() || ''
      setSearchKeyword(keyword)
    }
  }

  let contents
  const groupChallenges: GroupChallengeItem[] = data?.pages.flatMap(page => page.data.groupChallenges ?? []) ?? []
  /** 검색값이 없는 경우 */
  if (!groupChallenges || groupChallenges.length === 0) {
    contents = (
      <StyledNoContent
        title='검색 결과가 없습니다'
        buttonText='챌린지 생성하기'
        clickHandler={() => router.push(URL.CHALLENGE.GROUP.CREATE.value(category))} // 해당 카테고리로 생성하러 가기
      />
    )
  } else {
    /** 검색값이 있는 경우 */
    const testGroupChallenges = [...groupChallenges, ...groupChallenges, ...groupChallenges, ...groupChallenges]
    contents = testGroupChallenges.map(challenge => {
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
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const SearchBar = styled.form`
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

const ChallengeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 16px;
  margin-top: 24px;
`

const ObserverTrigger = styled.div`
  height: 1px;
`

const StyledNoContent = styled(NoContent)`
  margin: 60px 0;
`
