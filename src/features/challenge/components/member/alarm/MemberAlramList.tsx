'use client'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { useInfiniteMemberAlarmList } from '@features/member/hooks/useInfiniteMemberAlarmList'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { theme } from '@shared/styles/theme'
import { ISOFormatString } from '@shared/types/date'

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
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteMemberAlarmList()
  const { mutate: alarmAllRead } = useMutationStore<null, void>(MUTATION_KEYS.MEMBER.NOTIFICATION.READ)

  const alarms = data?.pages.flatMap(page => page?.data?.notifications || []) ?? []
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    alarmAllRead()
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
        {isLoading ? null : alarms.length !== 0 ? (
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
  background: ${theme.colors.lfWhite.base};
  border: solid 1px ${theme.colors.lfGreenBorder.base};
  padding: 16px;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
`

const AlarmImage = styled.img`
  width: 62px;
  height: 62px;
  object-fit: cover;
  border: solid 1px ${theme.colors.lfGreenBorder.base};
  border-radius: ${theme.radius.full};
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 4px;
`

const AlarmTitle = styled.div`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 한 줄 말줄임 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

const AlarmDesc = styled.div`
  font-size: ${theme.fontSize.sm};
  margin-top: 8px;
  color: ${theme.colors.lfDarkGray.base};
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 두 줄 말줄임 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
