import { useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/constant'
import { ChallengeCategoryType } from '@entities/challenge/type'
import {
  DeleteGroupChallengeResponse,
  DeleteGroupChallengeVariables,
} from '@features/challenge/api/delete-group-challenge'
import { LeafReward } from '@shared/components'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { DateFormatString } from '@shared/types/date'

export type GroupChallenge = {
  id: number
  name: string
  description: string
  startDate: DateFormatString // YYYY-mm-dd
  endDate: DateFormatString
  imageUrl: string
  currentParticipantCount: number
  category: ChallengeCategoryType

  leafReward?: number // 생성한 챌린지에는 없음
}

interface GroupChallengeCardProps {
  data: GroupChallenge

  isAuth: boolean // 본인의 챌린지인지 여부

  deleteCallback: () => void // 삭제 후 실행 콜백

  className?: string
}

export const GroupChallengeCard = ({
  data,
  isAuth = false,
  deleteCallback,
  className,
}: GroupChallengeCardProps): ReactNode => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const openToast = useToast()
  const { openConfirmModal } = useConfirmModalStore()

  /** Mutations */
  /** 단체 챌린지 삭제 */
  const { mutate: DeleteGroupChallengeMutate, isPending: isDeleting } = useMutationStore<
    DeleteGroupChallengeResponse,
    DeleteGroupChallengeVariables
  >(MUTATION_KEYS.CHALLENGE.GROUP.DELETE)

  /** 단체 챌린지 상세 보기 */
  const handleShowDetails = (id: number) => {
    router.push(URL.CHALLENGE.GROUP.DETAILS.value(id))
  }

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
              deleteCallback()
              openToast(ToastType.Success, '챌린지가 삭제되었습니다')
            },
          },
        ),
    })
  }

  const { id, imageUrl, name, description, currentParticipantCount, category, endDate, startDate, leafReward } = data
  const KOR_category = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) // 카테고리를 한글로 변경

  return (
    <ChallengeCard onClick={() => handleShowDetails(id)}>
      <TopImageWrapper>
        <ChallengeImage src={imageUrl} alt='챌린지 이미지' />
        <Badge className='badge'>{KOR_category}</Badge>
      </TopImageWrapper>
      <CardBody>
        <TopRow>
          <ChallengeName>{name}</ChallengeName>
          {isAuth && (
            <ActionButtons>
              <ModifyButton type='button' onClick={event => handleModify(event, id, name, currentParticipantCount)}>
                수정
              </ModifyButton>
              <DeleteButton type='button' onClick={event => handleDelete(event, id, name, currentParticipantCount)}>
                삭제
              </DeleteButton>
            </ActionButtons>
          )}
        </TopRow>
        <ChallengeDesc>{description}</ChallengeDesc>
        <ParticipantCount>
          <LucideIcon name='UsersRound' size={12} color='lfBlue' />
          <span>{currentParticipantCount}명 참여</span>
        </ParticipantCount>
      </CardBody>

      {leafReward && <StyledLeafReward reward={leafReward} />}
    </ChallengeCard>
  )
}

/** Styles */

const ChallengeCard = styled.div`
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  cursor: pointer;
  transition: transform 0.3s ease;

  position: relative;

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
  background: ${({ theme }) => theme.colors.lfGreenMain.base};
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.full};
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
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const ActionButtons = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.sm};
  gap: 8px;
`

const ModifyButton = styled.button`
  color: ${({ theme }) => theme.colors.lfBlack.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.lfBlue.base};
  }
`

const DeleteButton = styled.button`
  color: ${({ theme }) => theme.colors.lfRed.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.lfRed.hover};
  }
`

const ChallengeDesc = styled.div`
  margin: 10px 0 27px 0;
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
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
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlue.base};
`

const StyledLeafReward = styled(LeafReward)`
  bottom: 4%;
  right: 9%;
`
