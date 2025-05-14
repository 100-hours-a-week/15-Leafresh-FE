'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useInfiniteMemberAlarmList } from '@features/member/hooks/useInfiniteMemberAlarmList'
import { theme } from '@shared/styles/theme'

import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { ISOFormatString } from '@shared/types/date'
import { readAllAlarms } from '@features/member/api/read-all-alarms'

export const toISOFormatString = (date: Date): ISOFormatString => date.toISOString() as ISOFormatString

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

const MemberAlarmList = () => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberAlarmList()
  const { mutate: alarmAllRead } = useMutationStore<null, void>(MUTATION_KEYS.MEMBER.NOTIFICATION.READ)

  const alarms = data?.pages.flatMap(page => page?.data?.items || []) ?? []
  // const alarms = dummyAlarms
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    readAllAlarms()
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
    <Wrapper>
      <Title>알림</Title>
      <AlarmList>
        {alarms.length !== 0 ? (
          alarms.map(alarm => (
            <AlarmCard key={alarm.id}>
              <AlarmImage src={alarm.imageUrl} alt='알림 이미지' />
              <Content>
                <AlarmTitle>{alarm.title}</AlarmTitle>
                <AlarmDesc>{alarm.content}</AlarmDesc>
                <CreatedAt>{formatRelativeTime(new Date(alarm.createdAt))}</CreatedAt>
              </Content>
            </AlarmCard>
          ))
        ) : (
          <NoAlarmText>도착한 알림이 없습니다!</NoAlarmText>
        )}
      </AlarmList>
      <Observer ref={triggerRef}>{isFetchingNextPage && '불러오는 중...'}</Observer>
    </Wrapper>
  )
}

export default MemberAlarmList

// === 스타일 ===

const Wrapper = styled.div`
  padding: 24px 0;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 20px;
`

const AlarmList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const AlarmCard = styled.div`
  display: flex;
  gap: 12px;
  background: ${theme.colors.lfInputBackground.base};
  padding: 16px;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
`

const AlarmImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: ${theme.radius.base};
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const AlarmTitle = styled.div`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
  white-space: pre-wrap;
  word-break: break-word;
`

const AlarmDesc = styled.div`
  font-size: ${theme.fontSize.sm};
  margin-top: 8px;
  color: ${theme.colors.lfDarkGray.base};
  white-space: pre-wrap;
  word-break: break-word;
`

const CreatedAt = styled.div`
  align-self: flex-end;
  font-size: ${theme.fontSize.xs};
  margin-top: 8px;
  color: ${theme.colors.lfDarkGray.base};
`

const Observer = styled.div`
  height: 1px;
`

const NoAlarmText = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfRed.base};
`
