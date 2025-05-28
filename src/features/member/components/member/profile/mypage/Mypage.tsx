'use client'
import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { theme } from '@shared/styles/theme'

import { useQuery } from '@tanstack/react-query'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'

import { getMemberProfile, Profile } from '@features/member/api/get-member-profile'
import { Badge, getRecentBadges } from '@features/member/api/get-recent-badge'
import { getMemberProfileCard, ProfileCardData } from '@features/member/api/get-member-profilecard'

import ProfileBox from './ProfileBox'
import RecentBadgeBox from './RecentBadgeBox'
import { ApiResponse } from '@shared/lib/api/fetcher/type'
import ProfileCard from './ProfileCard'

import { useFeedbackSSE } from '@features/member/hooks/useFeedbackSSE'

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

const Mypage = () => {
  const router = useRouter()
  const [count, setCount] = useState(8)
  const [showProfileCard, setShowProfileCard] = useState(false)

  const { messages, isStreaming, startFeedbackStream } = useFeedbackSSE()

  // const dummyBadges: Badge[] = [
  //   {
  //     id: 1,
  //     name: '친환경 지킴이',
  //     condition: '첫 챌린지 성공',
  //     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/treelevel/YOUNG.png',
  //   },
  //   {
  //     id: 2,
  //     name: '제로웨이스트 스타터',
  //     condition: '제로웨이스트 챌린지 3회 참여',
  //     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/treelevel/YOUNG.png',
  //   },
  //   {
  //     id: 3,
  //     name: '플로깅 마스터',
  //     condition: '플로깅 5일 연속 인증',
  //     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/treelevel/YOUNG.png',
  //   },
  // ]

  const { data: profileData, isError } = useQuery<ApiResponse<Profile>>({
    queryKey: QUERY_KEYS.MEMBER.DETAILS,
    queryFn: getMemberProfile,
    ...QUERY_OPTIONS.MEMBER.DETAILS,
  })

  const { data: recentBadgesData } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.BADGES.RECENT(count),
    queryFn: () => getRecentBadges({ count }),
    ...QUERY_OPTIONS.MEMBER.BADGES.RECENT,
  })

  const { data: profileCardData } = useQuery<ApiResponse<ProfileCardData>>({
    queryKey: QUERY_KEYS.MEMBER.PROFILE_CARD,
    queryFn: getMemberProfileCard,
    ...QUERY_OPTIONS.MEMBER.PROFILE_CARD,
  })

  if (!profileData) return null //로딩, fallback 처리

  const profile: Profile = profileData.data ?? ({} as Profile)
  const profileCard: ProfileCardData = profileCardData?.data ?? ({} as ProfileCardData)
  const recentbadges: Badge[] = recentBadgesData?.data.badges ?? []

  function handleProfileCardOpen() {
    setShowProfileCard(true)
  }

  return (
    <Container>
      <ProfileSection>
        <ProfileBox
          nickName={profile.nickname}
          profileImageUrl={profile.profileImageUrl}
          level={profile.treeLevelId}
          treeImageUrl={profile.treeImageUrl}
          onClick={handleProfileCardOpen}
        />
        <FeedbackBox>
          <FeedbackText>나의 친환경 활동 점수는?</FeedbackText>
          <FeedbackButton onClick={startFeedbackStream}>
            {isStreaming ? 'AI 피드백 받는 중...' : 'AI 피드백 받기'}
          </FeedbackButton>
          {messages.length > 0 && (
            <ul style={{ marginTop: '10px', fontSize: '14px', color: 'black' }}>
              {messages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          )}
        </FeedbackBox>
      </ProfileSection>

      <BadgeSection>
        <RecentBadgeBox badges={recentbadges} />
      </BadgeSection>

      <RouteSection>
        <SectionTitle>나의 활동</SectionTitle>
        <MenuList>
          <MenuItem onClick={() => router.push(URL.MEMBER.CHALLENGES.CREATED.value)}>
            <MenuText>생성한 챌린지</MenuText>
            <ChevronIcon>〉</ChevronIcon>
          </MenuItem>
          <MenuItem onClick={() => router.push(URL.MEMBER.PROFILE.BADGE.value)}>
            <MenuText>나의 활동 배지</MenuText>
            <ChevronIcon>〉</ChevronIcon>
          </MenuItem>
          <MenuItem onClick={() => router.push(URL.MEMBER.STORE.PURCHASED.value)}>
            <MenuText>나의 상점 구매 목록</MenuText>
            <ChevronIcon>〉</ChevronIcon>
          </MenuItem>
        </MenuList>
      </RouteSection>
      <RouteSection>
        <SectionTitle>설정</SectionTitle>
        <MenuList>
          <MenuItem onClick={() => router.push(URL.MEMBER.PROFILE.MODIFY.value)}>
            <MenuText>프로필 수정</MenuText>
            <ChevronIcon>〉</ChevronIcon>
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

export default Mypage

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ProfileSection = styled.div`
  justify-content: center;
`

const FeedbackBox = styled.div`
  justify-content: center;
  width: 322px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background-color: #eff9e8;

  gap: 10px;
  align-items: center;
  justify-self: center;
  text-align: start;

  padding: 10px 0;
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfPrime};
`

const FeedbackText = styled.p`
  font-size: ${theme.fontSize.sm};
  padding-left: 20px;
  align-self: flex-start;
`

const FeedbackButton = styled.button`
  /* width: 70%; */
  padding: 5px 80px;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};

  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};

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
  position: fixed;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  z-index: 1000;
`
const RouteSection = styled.div`
  margin-top: 20px;
  align-self: center;
  width: 322px;
  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfPrime};
  overflow: hidden;
`

const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfWhite.base};
  padding: 16px 20px 8px;
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
  padding: 8px 20px;
  /* border-bottom: 1px solid ${theme.colors.lfGreenInactive.base}; */
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #eff9e8;
  }

  &:active {
    background-color: #eff9e8;
  }

  &:last-child {
    border-bottom: none;
  }
`

const MenuText = styled.span`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
`

const ChevronIcon = styled.span`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.lfGray.base};
  font-weight: ${theme.fontWeight.light};
`
