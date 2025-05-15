'use client'
import { useRouter, useSearchParams } from 'next/navigation'

import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import GroupChallengeCard from '@features/challenge/components/challenge/group/list/GroupChallengeCard'
import { useInfiniteGroupChallenges } from '@features/challenge/hook/useGroupChallengeList'
import Chatbot from '@shared/components/chatbot/Chatbot'
import GridBox from '@shared/components/Wrapper/GridBox'
import { URL } from '@shared/constants/route/route'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

type GroupChallenge = {
  id: number
  title: string
  thumbnailUrl: string
  leafReward: number
  startDate: string
  endDate: string
  remainingDay: number
  currentParticipantCount: number
}

const ChallengeListPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [input, setInput] = useState<string>('')

  // URL에서 category, search 파라미터 읽기
  const category = searchParams.get('category') || ''
  console.log(category)

  const initialSearch = searchParams.get('search') || ''

  // 로컬 input 초기화
  useEffect(() => {
    setInput(initialSearch)
  }, [initialSearch])

  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (input) params.set('search', input)
    else params.delete('search')
    router.push(`?${params.toString()}`)
  }

  // 무한 스크롤 훅 호출 (URL 변경 시 재요청)
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteGroupChallenges(
    category as string,
    initialSearch,
  )

  // 무한 스크롤 옵저버
  const observerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!hasNextPage || !observerRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage()
      },
      { rootMargin: '200px' },
    )
    obs.observe(observerRef.current)
    return () => obs.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // API 데이터 뽑아오기
  const groupChallenges: GroupChallenge[] = data?.pages.flatMap(p => p.data.groupChallenges) ?? []

  if (isLoading) return <Message>Loading challenges…</Message>
  if (error) return <Message>Error: {error.message}</Message>

  return (
    <Container>
      <BannerSection>
        <BannerText>
          <SubTitle>사진 한 장, 지구를 위한 따듯한 걸음</SubTitle>
          <Title>
            친환경 챌린지 <strong>Leafresh</strong>
          </Title>
        </BannerText>
      </BannerSection>

      <ContentWrapper>
        <Section>
          <Header>
            <Title>단체 챌린지{category && <Category> - {category}</Category>}</Title>
            <AddButton
              onClick={() => {
                const params = new URLSearchParams()
                if (category) params.set('category', category)
                router.push(`${URL.CHALLENGE.GROUP.CREATE.value}?${params.toString()}`)
              }}
              aria-label='추가'
            >
              <LucideIcon name='Plus' width={25} height={25} />
            </AddButton>
          </Header>

          <SearchBar onSubmit={handleSearchSubmit}>
            <SearchInput type='text' placeholder='챌린지 검색' value={input} onChange={e => setInput(e.target.value)} />
          </SearchBar>

          <ChallengeWrapper>
            {groupChallenges.length !== 0 && (
              <Grid>
                {groupChallenges.map(challenge => (
                  <StyledGroupChallengeCard key={challenge.id} challenge={challenge} />
                ))}
                {hasNextPage && <ObserverElement ref={observerRef} />}
              </Grid>
            )}
            {isFetchingNextPage && <LoadingMore>더 불러오는 중...</LoadingMore>}
            {groupChallenges.length === 0 && <EmptyState>진행 중인 챌린지가 없습니다.</EmptyState>}
          </ChallengeWrapper>
        </Section>
      </ContentWrapper>
      <Chatbot />
    </Container>
  )
}

export default ChallengeListPage

const Container = styled.div`
  max-width: 800px;
  min-height: 800px;
  display: flex;
  flex-direction: column;
`

const BannerSection = styled.section`
  min-width: 320px;
  max-width: 500px;
  width: 100vw;
  height: 240px;

  position: absolute;
  top: 0;
  left: 0;

  background-image: url('/image/banner_list.jpg');
  background-size: cover;
  background-position: center;

  display: flex;
  align-items: flex-end;
  color: ${theme.colors.lfWhite.base};
`

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 20px;
  margin-bottom: 40px;
`

const ContentWrapper = styled.div`
  margin-top: 240px; /* BannerSection 높이와 동일하게 설정 */
  background-color: white;
  width: 100%;
  z-index: 1;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
`

const SubTitle = styled.h2`
  font-size: ${theme.fontSize.base};
  margin-bottom: 8px;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  background-color: white;
  z-index: 100;
`
const Category = styled.span`
  font-size: 14px;
  color: ${theme.colors.lfGray.base};
  font-weight: ${theme.fontWeight.medium};
`
const AddButton = styled.button`
  all: unset;
  font-size: 24px;
  color: #333;
  cursor: pointer;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
`

const SearchBar = styled.form`
  padding: 10px 0px;
`

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px 15px 10px 35px;
  border-radius: 6px;
  border: none;
  background-color: #f3f3f3;
  font-size: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px;
`

const ChallengeWrapper = styled.div`
  padding: 16px 0px;
  display: flex;
  justify-content: center;
`

const ObserverElement = styled.div`
  width: 100%;
  height: 20px;
`

const LoadingMore = styled.div`
  text-align: center;
  padding: 10px;
  color: #666;
  font-size: 14px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${theme.colors.lfBlack.base};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`
const StyledGroupChallengeCard = styled(GroupChallengeCard)`
  width: 100%;
`

const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  cursor: pointer;

  &::before {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
`

const Message = styled.div`
  padding: 40px;
  text-align: center;
`

const Grid = styled(GridBox)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`
