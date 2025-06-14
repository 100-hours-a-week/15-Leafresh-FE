'use client'

import { useEffect, useRef } from 'react'

import { useInfiniteMemberAlarmList } from '@features/member/api/alarm/use-alarm-list'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'

import * as S from './styles'

export function formatRelativeTime(target: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - target.getTime()

  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`

  return target.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const MemberAlarmList = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberAlarmList()
  const { mutate: ReadAlarmMutate } = useMutationStore<null, void>(MUTATION_KEYS.MEMBER.NOTIFICATION.READ)

  const alarms = data?.pages.flatMap(page => page?.data?.notifications || []) ?? []
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ReadAlarmMutate()
  }, [])

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

  return (
    <S.Wrapper>
      <S.Title>알림</S.Title>
      <S.AlarmList>
        {isLoading ? null : alarms.length !== 0 ? (
          alarms.map(alarm => (
            <S.AlarmCard key={alarm.id}>
              <S.AlarmImage src={alarm.imageUrl} alt='알림 이미지' />
              <S.Content>
                <S.AlarmTitle>{alarm.title}</S.AlarmTitle>
                <S.AlarmDesc>{alarm.content}</S.AlarmDesc>
                <S.CreatedAt>{formatRelativeTime(new Date(alarm.createdAt))}</S.CreatedAt>
              </S.Content>
            </S.AlarmCard>
          ))
        ) : (
          <S.NoAlarmText>도착한 알림이 없습니다!</S.NoAlarmText>
        )}
      </S.AlarmList>
      <S.Observer ref={triggerRef}>{isFetchingNextPage && '단체 챌린지 불러오는 중...'}</S.Observer>
    </S.Wrapper>
  )
}
