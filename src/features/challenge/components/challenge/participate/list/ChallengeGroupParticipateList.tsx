'use client'

import Image from 'next/image'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { useInfiniteGroupChallengeVerifications } from '@features/challenge/hook/useInfiniteGroupChallengeVerifications'
import { theme } from '@shared/styles/theme'

interface ChallengeGroupParticipateListProps {
  challengeId: number
}

const ChallengeGroupParticipateList = ({ challengeId }: ChallengeGroupParticipateListProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGroupChallengeVerifications(challengeId)

  const verifications = data?.pages.flatMap(page => page?.data?.verifications || []) ?? []
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || !triggerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
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
      <Title>챌린지 제목</Title>
      <Grid>
        {verifications.length !== 0 ? (
          verifications.map(item => (
            <Card key={item.id}>
              <ProfileWrapper>
                <ProfileImage src={item.profileImageUrl} alt='프로필' width={16} height={16} />
                <span>{item.nickname}</span>
              </ProfileWrapper>
              <VerificationImage src={item.verificationImageUrl} alt='인증 이미지' width={150} height={150} />
              <Description>{item.description}</Description>
            </Card>
          ))
        ) : (
          <span>제출된 이미지가 없습니다.</span>
        )}
      </Grid>
      <Observer ref={triggerRef}>{isFetchingNextPage ? '불러오는 중...' : ''}</Observer>
    </Wrapper>
  )
}

export default ChallengeGroupParticipateList

const Wrapper = styled.div`
  padding: 16px;
`

const Title = styled.h1`
  text-align: center;
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.lg};
  margin-bottom: 24px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 16px;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
`

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
`

const ProfileImage = styled(Image)`
  border-radius: 9999px;
`

const VerificationImage = styled(Image)`
  margin-top: 8px;
  width: 100%;
  height: auto;
  border-radius: ${theme.radius.base};
  object-fit: cover;
`

const Description = styled.div`
  margin-top: 8px;
  font-size: ${theme.fontSize.xs};
  white-space: pre-wrap;
`

const Observer = styled.div`
  height: 1px;
`
