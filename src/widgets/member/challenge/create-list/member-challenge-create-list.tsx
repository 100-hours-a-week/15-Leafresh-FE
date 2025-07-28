'use client'

import { ReactNode, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { GroupChallenge, GroupChallengeCard } from '@/features/challenge/components'
import { useInfiniteMemberGroupChallengeCreations } from '@/features/member/api'

import { Loading } from '@/shared/components'
import { URL } from '@/shared/constants'
import { useUserStore } from '@/shared/context'

import * as S from './styles'

export const MemberChallengeCreationsPage = (): ReactNode => {
  const router = useRouter()
  const { userInfo } = useUserStore()

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useInfiniteMemberGroupChallengeCreations()
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !triggerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(triggerRef.current)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  /** 단체 챌린지 생성하러 가기 */
  const handleCreateChallenge = () => {
    router.push(URL.CHALLENGE.GROUP.CREATE.value())
  }

  const groupChallenges = data?.pages.flatMap(page => page?.data.groupChallenges || []) ?? []
  // const groupChallenges = dummyMemberGroupChallenge

  let contents: ReactNode

  if (isLoading) {
    contents = null
  } else if (groupChallenges.length === 0) {
    contents = (
      <S.StyledNoContentFeedback
        title='생성한 챌린지가 없습니다!'
        buttonText='챌린지 생성하러 가기'
        clickHandler={handleCreateChallenge}
      />
    )
  } else {
    contents = (
      <S.ChallengeList>
        {groupChallenges.map(groupChallenge => {
          const { id, imageUrl, name, description, currentParticipantCount, category, endDate, startDate } =
            groupChallenge
          const data: GroupChallenge = {
            id,
            imageUrl,
            name,
            description,
            currentParticipantCount,
            category,
            endDate,
            startDate,
          }
          return <GroupChallengeCard key={id} isAuth deleteCallback={() => refetch()} data={data} />
        })}
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && !isLoading && groupChallenges.length > 0 && (
          <S.EndMessage>생성한 챌린지를 모두 불러왔습니다</S.EndMessage>
        )}
      </S.ChallengeList>
    )
  }

  return (
    <S.Wrapper>
      <S.Title>{userInfo?.nickname || '익명'}의 단체 챌린지</S.Title>
      {contents}
      <S.Observer ref={triggerRef}>{isFetchingNextPage && '불러오는 중...'}</S.Observer>
    </S.Wrapper>
  )
}
