'use client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { GroupChallengeItem } from '@entities/challenge/api/get-group-challenge-list'
import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/model/consts'
import { useInfiniteGroupChallenges } from '@features/challenge/hook/useGroupChallengeList'
import { URL } from '@shared/constants/route/route'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import { categoryBannerMap } from '../model/constants'
import * as S from './styles'

import { Spinner } from '@chakra-ui/react'

export const ChallengeGroupListPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [input, setInput] = useState<string>('')

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

  const groupChallenges: GroupChallengeItem[] = data?.pages.flatMap(page => page.data.groupChallenges ?? []) ?? []

  if (isLoading) return <Spinner size='lg' style={{ marginTop: '100px' }} />
  if (error) return <S.Message>Error: {error.message}</S.Message>

  return (
    <S.Container>
      <S.BannerSection bannerUrl={bannerUrl}></S.BannerSection>

      <S.ContentWrapper>
        <S.Section>
          <S.Header>
            <S.Title>{korCategory}</S.Title>
            <S.AddButton
              onClick={() => {
                const params = new URLSearchParams()
                if (category) params.set('category', category)
                router.push(`${URL.CHALLENGE.GROUP.CREATE.value(params.toString())}`)
              }}
              aria-label='추가'
            >
              <LucideIcon name='Plus' width={25} height={25} />
            </S.AddButton>
          </S.Header>

          <S.SearchBar onSubmit={handleSearchSubmit}>
            <S.SearchInput
              type='text'
              inputMode='search'
              placeholder='챌린지 검색'
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </S.SearchBar>

          <S.ChallengeWrapper>
            {groupChallenges.length === 0 && (
              <S.EmptySection>
                <Image
                  src='/image/main-icon.svg'
                  alt='Leafresh'
                  width={80}
                  height={60}
                  style={{ alignSelf: 'center' }}
                />
                <S.EmptyState>진행 중인 챌린지가 없습니다.</S.EmptyState>
                <S.EmptyButton
                  onClick={() => {
                    const params = new URLSearchParams()
                    if (category) params.set('category', category)
                    router.push(`${URL.CHALLENGE.GROUP.CREATE.value}?${params.toString()}`)
                  }}
                >
                  챌린지 생성하러 가기
                </S.EmptyButton>
              </S.EmptySection>
            )}
            {groupChallenges.length !== 0 && (
              <S.Grid>
                {groupChallenges.map(challenge => (
                  <S.StyledGroupChallengeCard key={challenge.id} challenge={challenge} />
                ))}
                {hasNextPage && <S.ObserverElement ref={observerRef} />}
              </S.Grid>
            )}
          </S.ChallengeWrapper>
        </S.Section>
      </S.ContentWrapper>
    </S.Container>
  )
}
