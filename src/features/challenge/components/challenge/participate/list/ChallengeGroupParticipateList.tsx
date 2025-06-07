'use client'

import Image from 'next/image'

import { useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { getGroupChallengeDetails } from '@features/challenge/api/get-group-challenge-details'
import { useInfiniteGroupChallengeVerifications } from '@features/challenge/hook/useInfiniteGroupChallengeVerifications'
import BackButton from '@shared/components/button/BackButton'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { theme } from '@shared/styles/theme'

interface ChallengeGroupParticipateListProps {
  challengeId: number
}

const ChallengeGroupParticipateList = ({ challengeId }: ChallengeGroupParticipateListProps) => {
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
  const verifications = verificationData?.pages.flatMap(page => page?.data?.items || []) ?? []

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
      <TitleWrapper>
        <StyledBackButton />
        {/* TODO: API에 챌린지 제목 필드가 추가되면 넣기 */}
        <Title>단체 챌린지</Title>
      </TitleWrapper>
      <Grid>
        {verifications.length !== 0 ? (
          verifications.map(item => (
            <Card key={item.id}>
              <ProfileWrapper>
                <ProfileImage src={item.profileImageUrl} alt='프로필' width={16} height={16} />
                <Nickname>{item.nickname}</Nickname>
              </ProfileWrapper>
              <VerificationImage src={item.verificationImageUrl} alt='인증 이미지' width={150} height={150} />
              <Description>{item.description}</Description>
            </Card>
          ))
        ) : (
          <NoImageText>제출된 이미지가 없습니다!</NoImageText>
        )}
      </Grid>
      <Observer ref={triggerRef}>{isFetchingNextPage ? '불러오는 중...' : ''}</Observer>
    </Wrapper>
  )
}

export default ChallengeGroupParticipateList

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  gap: 40px;
`
const TitleWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledBackButton = styled(BackButton)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`

const Title = styled.h1`
  text-align: center;
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.lg};
`

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 20px;
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
const Nickname = styled.span`
  font-size: ${theme.fontSize.sm};
`

const VerificationImage = styled(Image)`
  margin-top: 8px;
  width: 100%;
  height: auto;
  border-radius: ${theme.radius.base};
  object-fit: cover;
`

const Description = styled.div`
  margin-top: 12px;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  white-space: pre-wrap;
  word-break: break-word;
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
// const dummyVerifications: VerificationType[] = [
//   {
//     id: 1,
//     nickname: '지호님',
//     profileImageUrl: '/icon/category_book_share.png',
//     verificationImageUrl: '/icon/category_book_share.png',
//     description:
//       'asdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsaddaasdsadda',
//   },
//   {
//     id: 2,
//     nickname: 'LeafreshUser',
//     profileImageUrl: '/icon/category_book_share.png',
//     verificationImageUrl: '/icon/category_book_share.png',
//     description: '플로깅 완료!',
//   },
//   {
//     id: 3,
//     nickname: '그린이',
//     profileImageUrl: '/icon/category_book_share.png',
//     verificationImageUrl: '/icon/category_book_share.png',
//     description: '분리수거 인증이에요.',
//   },
//   {
//     id: 4,
//     nickname: '그린이',
//     profileImageUrl: '/icon/category_book_share.png',
//     verificationImageUrl: '/icon/category_book_share.png',
//     description: '분리수거 인증이에요.',
//   },
//   {
//     id: 5,
//     nickname: '그린이',
//     profileImageUrl: '/icon/category_book_share.png',
//     verificationImageUrl: '/icon/category_book_share.png',
//     description: '분리수거 인증이에요.',
//   },
//   {
//     id: 6,
//     nickname: '그린이',
//     profileImageUrl: '/icon/category_book_share.png',
//     verificationImageUrl: '/icon/category_book_share.png',
//     description: '분리수거 인증이에요.',
//   },
// ]
