import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import { DeleteGroupChallengeResponse, DeleteGroupChallengeVariables } from '@entities/challenge/api/group/delete-group'
import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/model'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import { GroupChallengeCardProps } from '../model/types'
import * as S from './styles'

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
    if (currentParticipantCount) {
      openToast(ToastType.Error, `이미 참여자가 있는 챌린지는\n수정할 수 없습니다!`)
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
    if (currentParticipantCount) {
      openToast(ToastType.Error, `이미 참여자가 있는 챌린지는\n삭제할 수 없습니다!`)
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
              if (deleteCallback) deleteCallback()
              openToast(ToastType.Success, '챌린지가 삭제되었습니다')
            },
          },
        ),
    })
  }

  const { id, imageUrl, name, description, currentParticipantCount, category, endDate, startDate, leafReward } = data
  const KOR_category = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) // 카테고리를 한글로 변경

  return (
    <S.ChallengeCard onClick={() => handleShowDetails(id)}>
      <S.TopImageWrapper>
        <S.ChallengeImage src={imageUrl} alt='챌린지 이미지' />
        <S.Badge className='badge'>{KOR_category}</S.Badge>
      </S.TopImageWrapper>
      <S.CardBody>
        <S.TopRow>
          <S.ChallengeName>{name}</S.ChallengeName>
          {isAuth && (
            <S.ActionButtons>
              <S.ModifyButton type='button' onClick={event => handleModify(event, id, name, currentParticipantCount)}>
                수정
              </S.ModifyButton>
              <S.DeleteButton type='button' onClick={event => handleDelete(event, id, name, currentParticipantCount)}>
                삭제
              </S.DeleteButton>
            </S.ActionButtons>
          )}
        </S.TopRow>
        <S.ChallengeDesc>{description}</S.ChallengeDesc>
        <S.ParticipantCount>
          <LucideIcon name='UsersRound' size={12} color='lfBlue' />
          <span>{currentParticipantCount}명 참여</span>
        </S.ParticipantCount>
      </S.CardBody>

      {leafReward && <S.StyledLeafReward reward={leafReward} />}
    </S.ChallengeCard>
  )
}
