'use client'
import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
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
import { theme, MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { ToastType, useOAuthUserStore, usePollingStore, useUserStore } from '@/shared/context'
import { useAuth, useToast } from '@/shared/hooks'
import { responsiveHorizontalPadding } from '@/shared/styles'

const slideRotateIn = keyframes`
  0% {
    transform: translateX(-50%) translateY(200px) rotateY(0deg); /* 뷰포트 아래쪽에서 시작 */
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotateY(360deg); /* 화면 중앙 + 360도 회전 */
    opacity: 1;
  }
`

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
    <Container isScroll={showProfileCard}>
      <ProfileSection>
        <ProfileBox
          nickName={profile.nickname}
          profileImageUrl={profile.profileImageUrl}
          level={profile.treeLevelId}
          treeImageUrl={profile.treeImageUrl}
          onClick={handleProfileCardOpen}
        />
        <FeedbackBox>
          <FeedbackText>나의 친환경 활동 피드백</FeedbackText>
          {(shouldPoll || isFetching) && <Loading />}

          {/* 피드백 */}
          {feedback?.content && !shouldPoll && <Feedback>{feedback.content}</Feedback>}

          {/* 피드백 요청 버튼 조건 분기 */}
          {feedback?.content === null && !shouldPoll && !pollError && (
            <FeedbackButton onClick={handleRequestFeedback}>AI 피드백 받기</FeedbackButton>
          )}

          {/* 에러 발생 시 다시 시도 버튼만 표시 */}
          {pollError && !shouldPoll && (
            <>
              <FeedbackButton onClick={handleRequestFeedback}>다시 시도</FeedbackButton>
              <ErrorMessage>{pollError}</ErrorMessage>
            </>
          )}
        </FeedbackBox>
      </ProfileSection>

      <BadgeSection>
        <RecentBadgeBox badges={recentbadges} />
      </BadgeSection>

      <RouteSection>
        <SectionTitle>나의 이용 내역</SectionTitle>
        <MenuList>
          <MenuItem onClick={() => router.push(URL.MEMBER.CHALLENGE.CREATE.LIST.value)}>
            <MenuText>생성한 챌린지</MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </MenuItem>
          <MenuItem onClick={() => router.push(URL.MEMBER.PROFILE.BADGE.value)}>
            <MenuText>활동 뱃지</MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </MenuItem>
          <MenuItem onClick={() => router.push(URL.MEMBER.STORE.PURCHASED.value)}>
            <MenuText>구매 목록</MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </MenuItem>
        </MenuList>
      </RouteSection>
      <RouteSection>
        <SectionTitle>설정</SectionTitle>
        <MenuList>
          <MenuItem onClick={() => router.push(URL.MEMBER.PROFILE.MODIFY.value)}>
            <MenuText>프로필 수정</MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <MenuText style={{ color: 'red' }}>로그아웃</MenuText>
            <LucideIcon name='ChevronRight' size={24} strokeWidth={1.5} />
          </MenuItem>
        </MenuList>
      </RouteSection>
      {showProfileCard && (
        <AnimatedCardWrapper>
          <ProfileCard data={profileCard} onDismiss={() => setShowProfileCard(false)} />
        </AnimatedCardWrapper>
      )}
    </Container>
  )
}

const Container = styled.div<{ isScroll: boolean }>`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;

  gap: 20px;
  overflow: ${({ isScroll }) => (isScroll ? 'hidden' : 'auto')};
`

const ProfileSection = styled.div`
  justify-content: center;
`

const FeedbackBox = styled.div`
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  display: flex;
  padding: 15px;
  flex-direction: column;
  background-color: #eff9e8;

  gap: 16px;
  align-items: center;
  justify-self: center;
  text-align: start;

  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfPrime};
`

const FeedbackText = styled.p`
  font-size: ${theme.fontSize.md};
  /* padding-left: 20px; */
  font-weight: ${theme.fontWeight.semiBold};
  align-self: flex-start;
`
const Feedback = styled.p`
  white-space: pre-line;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`

const FeedbackButton = styled.button`
  width: 80%;
  height: 40px;

  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};

  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};

  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lfGreenMain.hover};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`
const BadgeSection = styled.div`
  justify-content: center;
`
const AnimatedCardWrapper = styled.div`
  animation: ${slideRotateIn} 1.6s ease forwards;
  position: fixed; /* ✅ 수정 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* ✅ 중앙 정렬 */
  transform-origin: center center;
  z-index: 1000;
`
const RouteSection = styled.div`
  align-self: center;
  width: 100%;
  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfPrime};
  overflow: hidden;

  :last-child {
    margin-bottom: 10px;
  }
`

const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfWhite.base};
  padding: 11px 20px;
  margin: 0;
  background-color: ${theme.colors.lfGreenMain.base};
`

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.lfInputBackground.base};
  }

  &:active {
    background-color: #eff9e8;
  }

  &:last-child {
    border-bottom: none;
  }
`

const MenuText = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
`

const ErrorMessage = styled.div`
  color: ${theme.colors.lfRed.base};
  font-size: ${theme.fontSize.sm};
  padding: 4px 0;
`
