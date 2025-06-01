'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useRef } from 'react'
import styled from '@emotion/styled'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/constant'
import {
  DeleteGroupChallengeResponse,
  DeleteGroupChallengeVariables,
} from '@features/challenge/api/delete-group-challenge'
import { useInfiniteMemberGroupChallengeCreations } from '@features/member/hooks/useInfiniteMemberChallengeCreationsList'
import NoContent from '@shared/components/no-content/no-content'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

const MemberChallengeCreationsPage = (): ReactNode => {
  const router = useRouter()
  const { userInfo, isLoggedIn } = useAuth()
  const openToast = useToast()

  const { openConfirmModal } = useConfirmModalStore()
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useInfiniteMemberGroupChallengeCreations()
  const triggerRef = useRef<HTMLDivElement>(null)

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

  /** 단체 챌린지 삭제 */
  const { mutate: DeleteGroupChallengeMutate, isPending: isDeleting } = useMutationStore<
    DeleteGroupChallengeResponse,
    DeleteGroupChallengeVariables
  >(MUTATION_KEYS.CHALLENGE.GROUP.DELETE)

  /** 단체 챌린지 수정 */
  const handleModify = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
    name: string,
    currentParticipantCount: number,
  ) => {
    // 0. 버블링 방지
    event.stopPropagation()

    // 1. 로그인 상태 확인
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }
    // 2. 참여자 여부 확인 (없어야 함)
    if (!currentParticipantCount) {
      openToast(ToastType.Error, '참여자가 있어, 수정할 수 없습니다!')
      return
    }

    // 3. 단체 챌린지 수정 페이지로 이동
    router.push(URL.CHALLENGE.GROUP.MODIFY.value(id))
  }

  /** 단체 챌린지 삭제 */
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
    name: string,
    currentParticipantCount: number,
  ) => {
    // 0. 버블링 방지
    event.stopPropagation()

    // 1. 로그인 상태 확인
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }
    // 2. 참여자 여부 확인 (없어야 함)
    if (!currentParticipantCount) {
      openToast(ToastType.Error, '참여자가 있어, 삭제할 수 없습니다!')
      return
    }

    // 3. 확인 모달 열기
    const title = name.trim().endsWith('챌린지') ? `${name}를 삭제하시겠습니까?` : `${name} 챌린지를 삭제하시겠습니까?`

    openConfirmModal({
      title,
      description: '삭제 시 되돌릴 수 없습니다',
      onConfirm: () =>
        DeleteGroupChallengeMutate(
          { challengeId: id },
          {
            // 성공
            onSuccess(data, variables, context) {
              // 리로드
              refetch()
              openToast(ToastType.Success, '챌린지가 삭제되었습니다')
            },
          },
        ),
    })
  }

  /** 단체 챌린지 상세 보기 */
  const handleShowDetails = (id: number) => {
    router.push(URL.CHALLENGE.GROUP.DETAILS.value(id))
  }

  /** 단체 챌린지 생성하러 가기 */
  const handleCreateChallenge = () => {
    router.push(URL.CHALLENGE.GROUP.CREATE.value)
  }

  const groupChallenges = data?.pages.flatMap(page => page?.data.groupChallenges || []) ?? []
  // const groupChallenges = dummyMemberGroupChallenge

  let contents: ReactNode

  if (isLoading) {
    contents = null
  } else if (groupChallenges.length === 0) {
    contents = <NoContent title='생성한 챌린지가 없습니다!' buttonText='챌린지 생성하러 가기' clickHandler={handleCreateChallenge} />
  
  } else {
    contents = (
      <ChallengeList>
        {groupChallenges.map(groupChallenge => {
          const { id, imageUrl, name, description, currentParticipantCount, category } = groupChallenge
          const KOR_category = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category)

          return (
            <ChallengeCard key={id} onClick={() => handleShowDetails(id)}>
              <TopImageWrapper>
                <ChallengeImage src={imageUrl} alt='챌린지 이미지' />
                <Badge className='badge'>{KOR_category}</Badge>
              </TopImageWrapper>
              <CardBody>
                <TopRow>
                  <ChallengeName>{name}</ChallengeName>
                  <ActionButtons>
                    <ModifyButton
                      type='button'
                      onClick={event => handleModify(event, id, name, currentParticipantCount)}
                    >
                      수정
                    </ModifyButton>
                    <DeleteButton
                      type='button'
                      onClick={event => handleDelete(event, id, name, currentParticipantCount)}
                    >
                      삭제
                    </DeleteButton>
                  </ActionButtons>
                </TopRow>
                <ChallengeDesc>{description.repeat(5)}</ChallengeDesc>
                <ParticipantCount>
                  <LucideIcon name='UsersRound' size={12} color='lfBlue' />
                  <span>{currentParticipantCount}명 참여</span>
                </ParticipantCount>
              </CardBody>
            </ChallengeCard>
          )
        })}
      </ChallengeList>
    )
  }

  return (
    <Wrapper>
      <Title>{userInfo?.nickname || '익명'}의 단체 챌린지</Title>
      {contents}
      <Observer ref={triggerRef}>{isFetchingNextPage && '불러오는 중...'}</Observer>
    </Wrapper>
  )
}

export default MemberChallengeCreationsPage

const Wrapper = styled.div`
  min-height: calc(100dvh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; // ✔️ 여기서 중앙 배치로 전환
  padding: 24px 0;
`

const Title = styled.h1`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: 20px;
  text-align: center;
`

const ChallengeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const ChallengeCard = styled.div`
  background: ${theme.colors.lfWhite.base};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${theme.shadow.lfInput};
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    .badge {
      opacity: 1;
    }
  }
`

const TopImageWrapper = styled.div`
  background: #d9d9d9;
  width: 100%;
  aspect-ratio: 3/2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`

const ChallengeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${ChallengeCard}:hover & {
    transform: scale(1.05); // ✅ 1.1배 확대
  }
`

const Badge = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 12px 12px;
  background: ${theme.colors.lfGreenMain.base};
  opacity: 0.7;
  color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  border-radius: ${theme.radius.full};
  transition: opacity 0.3s ease;
`

const CardBody = styled.div`
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ChallengeName = styled.div`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.semiBold};
`

const ActionButtons = styled.div`
  display: flex;
  font-size: ${theme.fontSize.sm};
  gap: 8px;
`

const ModifyButton = styled.button`
  color: ${theme.colors.lfBlack.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${theme.colors.lfBlue.base};
  }
`

const DeleteButton = styled.button`
  color: ${theme.colors.lfRed.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${theme.colors.lfRed.hover};
  }
`

const ChallengeDesc = styled.div`
  margin: 10px 0 27px 0;
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.lfBlack.base};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ParticipantCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlue.base};
`

const Observer = styled.div`
  height: 1px;
`

// const dummyMemberGroupChallenge: GroupChallengeResponse[] = [
//   {
//     id: 1,
//     name: '제로 웨이스트 도전!',
//     description: '일회용품 줄이기 미션에 도전하세요!',
//     startDate: '2025-06-01',
//     endDate: '2025-06-30',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 42,
//     category: 'UPCYCLING',
//   },
//   {
//     id: 2,
//     name: '텀블러 챌린지',
//     description: '텀블러를 사용하고 인증해요!',
//     startDate: '2025-06-05',
//     endDate: '2025-06-20',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 18,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 3,
//     name: '플로깅 마스터',
//     description: '조깅하며 쓰레기를 줍는 챌린지!',
//     startDate: '2025-06-10',
//     endDate: '2025-07-10',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 73,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 4,
//     name: '친환경 장보기',
//     description: '비닐 대신 장바구니 쓰기 도전!',
//     startDate: '2025-06-15',
//     endDate: '2025-06-30',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 55,
//     category: 'ZERO_WASTE',
//   },
//   {
//     id: 5,
//     name: '재활용 분리배출 고수',
//     description: '올바른 분리배출 습관 챌린지',
//     startDate: '2025-06-20',
//     endDate: '2025-07-15',
//     imageUrl: 'https://storage.googleapis.com/leafresh-images/init/user_icon.png',
//     currentParticipantCount: 39,
//     category: 'ZERO_WASTE',
//   },
// ]
// const dummyMemberGroupChallenge: GroupChallengeResponse[] = []
