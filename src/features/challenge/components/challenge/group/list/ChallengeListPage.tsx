'use client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import React, { useEffect, useRef, useState } from 'react'
import { Spinner } from '@chakra-ui/react'
import styled from '@emotion/styled'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/constant'
import { GroupChallengeItem } from '@features/challenge/api/get-group-challenge-list'
import GroupChallengeCard from '@features/challenge/components/challenge/group/list/GroupChallengeCard'
import { useInfiniteGroupChallenges } from '@features/challenge/hook/useGroupChallengeList'
import Chatbot from '@shared/components/chatbot/Chatbot'
import GridBox from '@shared/components/Wrapper/GridBox'
import { URL } from '@shared/constants/route/route'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

const ChallengeListPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [input, setInput] = useState<string>('')

  const categoryBannerMap: Record<string, string> = {
    ZERO_WASTE: '/image/challenge/zero_banner.png',
    PLOGGING: '/image/challenge/plogging_banner.png',
    CARBON_FOOTPRINT: '/image/challenge/foot_banner.png',
    ENERGY_SAVING: '/image/challenge/saving_banner.png',
    UPCYCLING: '/image/challenge/upcycle_banner.png',
    MEDIA: '/image/challenge/media_banner.png',
    DIGITAL_CARBON: '/image/challenge/carbon_banner.png',
    VEGAN: '/image/challenge/vegan_banner.png',
    ETC: '/image/challenge/banner_list.png',
  }

  // URL에서 category, search 파라미터 읽기
  const category = searchParams.get('category') || ''
  const bannerUrl = categoryBannerMap[category] || categoryBannerMap['ETC']

  const searchKeyword = searchParams.get('search') || ''

  const korCategory = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category)

  // 로컬 input 초기화
  useEffect(() => {
    setInput(searchKeyword)
  }, [searchKeyword])

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteGroupChallenges(
    category,
    searchKeyword,
  )

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input === '' && searchParams.get('search')) {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('search')
        router.replace(`?${params.toString()}`)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [input, searchParams, router])

  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (input) params.set('search', input)
    else params.delete('search')
    router.push(`?${params.toString()}`)
  }

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
  const groupChallenges: GroupChallengeItem[] = data?.pages.flatMap(p => p.groupChallenges || []).filter(Boolean) ?? []

  if (isLoading) return <Spinner size='lg' style={{ marginTop: '100px' }} />
  if (error) return <Message>Error: {error.message}</Message>

  return (
    <Container>
      <BannerSection bannerUrl={bannerUrl}>
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
            <Title>{korCategory}</Title>
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
            <SearchInput
              type='text'
              inputMode='search'
              placeholder='챌린지 검색'
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </SearchBar>

          <ChallengeWrapper>
            {groupChallenges.length === 0 && (
              <EmptySection>
                <Image
                  src='/image/main-icon.svg'
                  alt='Leafresh'
                  width={80}
                  height={60}
                  style={{ alignSelf: 'center' }}
                />
                <EmptyState>진행 중인 챌린지가 없습니다.</EmptyState>
                <EmptyButton
                  onClick={() => {
                    const params = new URLSearchParams()
                    if (category) params.set('category', category)
                    router.push(`${URL.CHALLENGE.GROUP.CREATE.value}?${params.toString()}`)
                  }}
                >
                  챌린지 생성하러 가기
                </EmptyButton>
              </EmptySection>
            )}
            {groupChallenges.length !== 0 && (
              <Grid>
                {groupChallenges.map(challenge => (
                  <StyledGroupChallengeCard key={challenge.id} challenge={challenge} />
                ))}
                {hasNextPage && <ObserverElement ref={observerRef} />}
              </Grid>
            )}
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

const BannerSection = styled.section<{ bannerUrl: string }>`
  min-width: 320px;
  max-width: 500px;
  width: 100vw;
  height: 240px;

  position: absolute;
  top: 0;
  left: 0;

  background-image: ${({ bannerUrl }) => `url(${bannerUrl})`};
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

  box-shadow: ${theme.shadow.lfInput};
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

const EmptySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${theme.colors.lfBlack.base};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`
const StyledGroupChallengeCard = styled(GroupChallengeCard)`
  width: 100%;
`

const Message = styled.div`
  padding: 40px;
  text-align: center;
`

const Grid = styled(GridBox)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`
const EmptyButton = styled.button`
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};
  width: 220px;
  height: 40px;
  align-self: center;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.lfPrime};
  cursor: pointer;
`
