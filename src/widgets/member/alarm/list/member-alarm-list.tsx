'use client'

import { useEffect, useRef } from 'react'

import { useInfiniteMemberAlarmList } from '@/features/member/api'
import { theme } from '@/shared/config'
import { MUTATION_KEYS, useMutationStore } from '@/shared/config'
import { getTimeDiff } from '@/shared/lib'
import { responsiveHorizontalPadding } from '@/shared/styles'
import styled from '@emotion/styled'

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
                <CreatedAt>{getTimeDiff(alarm.createdAt)}</CreatedAt>
              </Content>
            </AlarmCard>
          ))
        ) : (
          <NoAlarmText>아직 도착한 알림이 없습니다!</NoAlarmText>
        )}
      </AlarmList>
      <Observer ref={triggerRef}>{isFetchingNextPage && '단체 챌린지 불러오는 중...'}</Observer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${responsiveHorizontalPadding};
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
  -webkit-line-clamp: 2; /* 한 줄 말줄임 */
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
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};

  text-align: center;
`
