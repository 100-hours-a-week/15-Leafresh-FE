'use client'
import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { ProfileBox, ProfileCard, RecentBadgeBox } from '@/features/member/components'

import {
  FeedbackResponse,
  getFeedback,
  getMemberProfile,
  getMemberProfileCard,
  getRecentBadges,
  LogoutResponse,
  LogoutVariables,
  ProfileCardResponse,
  ProfileResponse,
  RecentBadge,
} from '@/entities/member/api'

import { Loading, LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { ToastType, useOAuthUserStore, usePollingStore, useUserStore } from '@/shared/context'
import { useAuth, useToast } from '@/shared/hooks'

import * as S from './styles'

export const Mypage = () => {
  const router = useRouter()
  const [count, setCount] = useState(8)
  const [pollError, setPollError] = useState<string | null>(null)
  const [showProfileCard, setShowProfileCard] = useState(false)

  const { OAuthUserInfo, clearOAuthUserInfo } = useOAuthUserStore()
  const { clearUserInfo } = useUserStore()
  const { isLoggedIn } = useAuth()
  const { setFeedbackPolling } = usePollingStore()

  const {
    polling: {
      member: { feedback: shouldPoll },
    },
  } = usePollingStore()

  const openToast = useToast()

  const { mutate: requestFeedback, isPending } = useMutationStore<null, void>(
    MUTATION_KEYS.MEMBER.FEEDBACK.POST_FEEDBACK,
  )

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

  const { data: feedbackData, isFetching } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.FEEDBACK.GET_FEEDBACK,
    queryFn: getFeedback,
    ...QUERY_OPTIONS.MEMBER.FEEDBACK,
  })

  const { mutate: LogoutMutate, isPending: isLoggingOut } = useMutationStore<LogoutResponse, LogoutVariables>(
    MUTATION_KEYS.MEMBER.AUTH.LOGOUT,
  )

  if (!profileData) return null //로딩, fallback 처리

  const profile: ProfileResponse = profileData.data ?? ({} as ProfileResponse)
  const profileCard: ProfileCardResponse = profileCardData?.data ?? ({} as ProfileCardResponse)
  const recentbadges: RecentBadge[] = recentBadgesData?.data.badges ?? []
  const feedback: FeedbackResponse | null = feedbackData?.data ?? null

  function handleProfileCardOpen() {
    setShowProfileCard(true)
  }

  const handleRequestFeedback = () => {
    // const body = { reason: 'WEEKLY_FEEDBACK' }
    requestFeedback(undefined, {
      onSuccess: () => {
        setFeedbackPolling()
      },
      onError: error => {
        const errMessage = error.message
        setPollError(errMessage)
      },
    })
  }

  /** 로그아웃 로직 */
  const handleLogout = () => {
    console.log('로그아웃')

    if (!isLoggedIn) {
      window.location.reload()
      return
    }

    const provider = OAuthUserInfo?.provider
    console.log('provider: ', provider)

    if (provider) {
      // console.log('provider: ', provider)

      LogoutMutate(
        { provider },
        {
          onSuccess: response => {
            clearOAuthUserInfo()
            clearUserInfo()
            openToast(ToastType.Success, '로그아웃 성공')
            router.push(URL.MAIN.INDEX.value)
          },
        },
      )
    }
  }
  return (
    <S.Container isScroll={showProfileCard}>
      <S.ProfileSection>
        <ProfileBox
          nickName={profile.nickname}
          profileImageUrl={profile.profileImageUrl}
          level={profile.treeLevelId}
          treeImageUrl={profile.treeImageUrl}
          onClick={handleProfileCardOpen}
        />
        <S.FeedbackBox>
          <S.FeedbackText>나의 친환경 활동 피드백</S.FeedbackText>
          {(shouldPoll || isFetching) && <Loading />}

          {/* 피드백 */}
          {feedback?.content && !shouldPoll && <S.Feedback>{feedback.content}</S.Feedback>}

          {/* 피드백 요청 버튼 조건 분기 */}
          {feedback?.content === null && !shouldPoll && !pollError && (
            <S.FeedbackButton onClick={handleRequestFeedback}>AI 피드백 받기</S.FeedbackButton>
          )}

          {/* 에러 발생 시 다시 시도 버튼만 표시 */}
          {pollError && !shouldPoll && (
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
        <S.SectionTitle>나의 이용 내역</S.SectionTitle>
        <S.MenuList>
          <S.MenuItem onClick={() => router.push(URL.MEMBER.CHALLENGE.CREATE.LIST.value)}>
            <S.MenuText>생성한 챌린지</S.MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </S.MenuItem>
          <S.MenuItem onClick={() => router.push(URL.MEMBER.PROFILE.BADGE.value)}>
            <S.MenuText>활동 뱃지</S.MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </S.MenuItem>
          <S.MenuItem onClick={() => router.push(URL.MEMBER.STORE.PURCHASED.value)}>
            <S.MenuText>구매 목록</S.MenuText>
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
          <S.MenuItem onClick={handleLogout}>
            <S.MenuText style={{ color: 'red' }}>로그아웃</S.MenuText>
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
