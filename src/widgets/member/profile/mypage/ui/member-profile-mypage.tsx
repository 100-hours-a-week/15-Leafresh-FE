'use client'
import { useRouter } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { FeedbackResponse, getFeedback } from '@features/member/api/profile/get-member-feedback'
import { pollFeedbackResult } from '@features/member/api/profile/get-member-feedback-result'
import { getMemberProfile, ProfileResponse } from '@features/member/api/profile/get-member-profile'
import { getMemberProfileCard, ProfileCardResponse } from '@features/member/api/profile/get-member-profilecard'
import { Badge, getRecentBadges } from '@features/member/api/profile/get-recent-badge'
import ProfileBox from '@features/member/components/member/profile/mypage/ProfileBox'
import ProfileCard from '@features/member/components/member/profile/mypage/ProfileCard'
import RecentBadgeBox from '@features/member/components/member/profile/mypage/RecentBadgeBox'
import Loading from '@shared/components/loading'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import * as S from './styles'
export const MemberProfileMypage = () => {
  const router = useRouter()
  const [count, setCount] = useState(8) // TODO: ENUM 화 하기
  const [isPolling, setIsPolling] = useState(false)
  const [pollError, setPollError] = useState<string | null>(null)
  const [showProfileCard, setShowProfileCard] = useState(false)

  const { mutate: requestFeedback } = useMutationStore<null, void>(MUTATION_KEYS.MEMBER.FEEDBACK.POST_FEEDBACK)

  const isMountedRef = useRef(true) //페이지 언마운트 시, 상태 변경(set... 호출) 방지

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  //기기의 너비가 390 이하라면 최근 획득 뱃지 6개만 get
  useEffect(() => {
    const updateCountByWidth = () => {
      if (window.innerWidth <= 390) {
        setCount(6)
      } else {
        setCount(8)
      }
    }

    // 최초 1회 실행
    updateCountByWidth()

    // 리사이즈
    window.addEventListener('resize', updateCountByWidth)

    // 클린업
    return () => {
      window.removeEventListener('resize', updateCountByWidth)
    }
  }, [])

  const { data: profileData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.DETAILS,
    queryFn: getMemberProfile,
    ...QUERY_OPTIONS.MEMBER.DETAILS,
  })

  const { data: recentBadgesData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.BADGES.RECENT(count),
    queryFn: () => getRecentBadges({ count }),
    ...QUERY_OPTIONS.MEMBER.BADGES.RECENT,
  })

  const { data: profileCardData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.PROFILE_CARD,
    queryFn: getMemberProfileCard,
    ...QUERY_OPTIONS.MEMBER.PROFILE_CARD,
  })

  const { data: feedbackData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.FEEDBACK.GET_FEEDBACK,
    queryFn: getFeedback,
    ...QUERY_OPTIONS.MEMBER.FEEDBACK,
  })

  if (!profileData) return null //로딩, fallback 처리

  const profile: ProfileResponse = profileData.data ?? ({} as ProfileResponse)
  const profileCard: ProfileCardResponse = profileCardData?.data ?? ({} as ProfileCardResponse)
  const recentbadges: Badge[] = recentBadgesData?.data.badges ?? []
  const feedback: FeedbackResponse | null = feedbackData?.data ?? null
  console.log(feedback?.content)

  function handleProfileCardOpen() {
    setShowProfileCard(true)
  }

  const handleRequestFeedback = () => {
    // const body = { reason: 'WEEKLY_FEEDBACK' }
    requestFeedback(undefined, {
      onSuccess: async () => {
        if (isMountedRef.current) {
          setIsPolling(true)
          setPollError(null) // 초기화
        }

        try {
          await pollFeedbackResult()
        } catch (err) {
          if (isMountedRef.current) {
            setPollError('피드백을 가져오는 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.')
          }
        } finally {
          if (isMountedRef.current) setIsPolling(false)
        }
      },
      onError: err => {
        if (isMountedRef.current) {
          console.log(err)
          setPollError('피드백 요청에 실패했어요.')
        }
      },
    })
  }

  return (
    <S.Container>
      <S.ProfileSection>
        <ProfileBox
          nickName={profile.nickname}
          profileImageUrl={profile.profileImageUrl}
          level={profile.treeLevelId}
          treeImageUrl={profile.treeImageUrl}
          onClick={handleProfileCardOpen}
        />
        <S.FeedbackBox>
          <S.FeedbackText>나의 친환경 활동 점수는?</S.FeedbackText>
          {isPolling && <Loading />}

          {/* 피드백 */}
          {feedback?.content && !isPolling && <S.Feedback>{feedback.content}</S.Feedback>}

          {/* 피드백 요청 버튼 조건 분기 */}
          {feedback?.content === null && !isPolling && !pollError && (
            <S.FeedbackButton onClick={handleRequestFeedback}>AI 피드백 받기</S.FeedbackButton>
          )}

          {/* 에러 발생 시 다시 시도 버튼만 표시 */}
          {pollError && !isPolling && (
            <>
              <S.FeedbackButton onClick={handleRequestFeedback}>다시 시도</S.FeedbackButton>
              <S.ErrorMessage>{pollError}</S.ErrorMessage>
            </>
          )}
        </S.FeedbackBox>
      </S.ProfileSection>

      <S.BadgeSection>
        <RecentBadgeBox badges={recentbadges} />
      </S.BadgeSection>

      <S.RouteSection>
        <S.SectionTitle>나의 활동</S.SectionTitle>
        <S.MenuList>
          <S.MenuItem onClick={() => router.push(URL.MEMBER.CHALLENGE.CREATE.LIST.value)}>
            <S.MenuText>생성한 챌린지</S.MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </S.MenuItem>
          <S.MenuItem onClick={() => router.push(URL.MEMBER.PROFILE.BADGE.value)}>
            <S.MenuText>나의 활동 뱃지</S.MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </S.MenuItem>
          <S.MenuItem onClick={() => router.push(URL.MEMBER.STORE.PURCHASED.value)}>
            <S.MenuText>나의 상점 구매 목록</S.MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </S.MenuItem>
        </S.MenuList>
      </S.RouteSection>
      <S.RouteSection>
        <S.SectionTitle>설정</S.SectionTitle>
        <S.MenuList>
          <S.MenuItem onClick={() => router.push(URL.MEMBER.PROFILE.MODIFY.value)}>
            <S.MenuText>프로필 수정</S.MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </S.MenuItem>
        </S.MenuList>
      </S.RouteSection>
      {showProfileCard && (
        <S.AnimatedCardWrapper>
          <ProfileCard data={profileCard} onDismiss={() => setShowProfileCard(false)} />
        </S.AnimatedCardWrapper>
      )}
    </S.Container>
  )
}
