'use client'

import { useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { useInfiniteMemberAlarmList } from '@/features/member/api'

import { AlarmType } from '@/entities/member/api'

import { MUTATION_KEYS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { getTimeDiff } from '@/shared/lib'

import * as S from './styles'

export const MemberAlarmList = () => {
  const router = useRouter()

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

  /** 알림 클릭시 라우팅 */
  const handleAlarmClick = (alarm: AlarmType) => {
    const { type, challengeId } = alarm

    if (type === 'PERSONAL') {
      router.push(URL.CHALLENGE.PERSONAL.DETAILS.value(challengeId))
    } else if (type === 'GROUP') {
      router.push(URL.CHALLENGE.GROUP.DETAILS.value(challengeId))
    }
  }

  return (
    <S.Wrapper>
      <S.Title>알림</S.Title>
      <S.AlarmList>
        {isLoading ? null : alarms.length !== 0 ? (
          alarms.map(alarm => (
            <S.AlarmCard key={alarm.id} onClick={() => handleAlarmClick(alarm)}>
              <S.AlarmImage src={alarm.imageUrl} alt='알림 이미지' />
              <S.Content>
                <S.AlarmTitle>{alarm.title}</S.AlarmTitle>
                <S.AlarmDesc>{alarm.content}</S.AlarmDesc>
                <S.CreatedAt>{getTimeDiff(alarm.createdAt)}</S.CreatedAt>
              </S.Content>
            </S.AlarmCard>
          ))
        ) : (
          <S.NoAlarmText>아직 도착한 알림이 없습니다!</S.NoAlarmText>
        )}
      </S.AlarmList>
      <S.Observer ref={triggerRef}>{isFetchingNextPage && '단체 챌린지 불러오는 중...'}</S.Observer>
    </S.Wrapper>
  )
}
