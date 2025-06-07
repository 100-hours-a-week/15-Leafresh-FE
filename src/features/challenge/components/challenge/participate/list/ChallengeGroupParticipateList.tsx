'use client'

import { useRouter } from 'next/navigation'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { getGroupChallengeDetails } from '@features/challenge/api/get-group-challenge-details'
import { Verification } from '@features/challenge/api/participate/get-group-participant-list'
import { useInfiniteGroupChallengeVerifications } from '@features/challenge/hook/useInfiniteGroupChallengeVerifications'
import NoContent from '@shared/components/no-content/no-content'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { theme } from '@shared/styles/theme'

import VerificationCard from '../verification/verification-card'

interface ChallengeGroupParticipateListProps {
  challengeId: number
}

// const verificationsDummy: Verification[] = [
//   {
//     id: 1,
//     nickname: '지호개발자',
//     profileImageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     verificationImageUrl: '/image/banner.png',
//     description:
//       '제로 웨이스트 실천! 텀블러 사용 완료 🥤🌱 제로 웨이스트 실천! 텀블러 사용 완료 🥤🌱 제로 웨이스트 실천! 텀블러 사용 완료 🥤🌱',
//     category: 'ZERO_WASTE',
//     counts: {
//       view: 120,
//       like: 35,
//       comment: 12,
//     },
//     createdAt: new Date().toISOString() as ISOFormatString,
//     isLiked: true,
//   },
//   {
//     id: 2,
//     nickname: '그린라이프',
//     profileImageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     verificationImageUrl: '/image/banner.png',
//     description: '재활용 분리수거 철저히 했습니다. 환경 보호는 습관!',
//     category: 'PLOGGING',
//     counts: {
//       view: 89,
//       like: 22,
//       comment: 4,
//     },
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() as ISOFormatString, // 5시간 전
//     isLiked: false,
//   },
//   {
//     id: 3,
//     nickname: 'eco친구',
//     profileImageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     verificationImageUrl: '/image/banner.png',
//     description: '비건 도시락 도전! 채식도 맛있어요 🥗',
//     category: 'VEGAN',
//     counts: {
//       view: 45,
//       like: 10,
//       comment: 1,
//     },
//     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() as ISOFormatString, // 하루 전
//     isLiked: true,
//   },
// ]
const verificationsDummy: Verification[] = []

const ChallengeGroupParticipateList = ({ challengeId }: ChallengeGroupParticipateListProps) => {
  const router = useRouter()

  /** 단체 챌린지 상세 가져오기 */
  const { data: challengeData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
    queryFn: () => getGroupChallengeDetails(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
  })
  /** 인증 목록 조회 */
  const {
    data: verificationData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGroupChallengeVerifications(challengeId)

  const challenge = challengeData?.data
  // const verifications = verificationData?.pages.flatMap(page => page?.data?.items || []) ?? []
  const verifications = verificationsDummy

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

  /** 이벤트 핸들러 */
  const handleParticipateChallenge = () => {
    // 단체 챌린지 상세로 이동
    router.push(URL.CHALLENGE.GROUP.DETAILS.value(challengeId))
  }

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{challenge?.title}</Title>
      </TitleWrapper>
      <ContentsWrapper>
        {verifications.length !== 0 ? (
          verifications.map(data => <VerificationCard key={data.id} data={data} />)
        ) : (
          <StyledNoContent
            title='아직 인증 내역이 없습니다'
            buttonText='참여하러 가기'
            clickHandler={handleParticipateChallenge}
          />
        )}
      </ContentsWrapper>
      <Observer ref={triggerRef}>{isFetchingNextPage ? '불러오는 중...' : ''}</Observer>
    </Wrapper>
  )
}

export default ChallengeGroupParticipateList

const Wrapper = styled.div`
  height: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 30px;
`
const TitleWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  text-align: center;
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.lg};
`

const ContentsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 32px;
`

const Observer = styled.div`
  height: 1px;
`

const NoImageText = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfRed.base};
`

const StyledNoContent = styled(NoContent)`
  height: 100%;
`
