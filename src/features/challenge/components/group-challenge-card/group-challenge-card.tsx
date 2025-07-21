'use client'

import { ReactNode } from 'react'

import { useRouter } from 'next/navigation'

import { DeleteGroupChallengeResponse, DeleteGroupChallengeVariables } from '@/entities/challenge/api'
import { CHALLENGE_CATEGORY_PAIRS, ChallengeCategoryType, convertLanguage } from '@/entities/challenge/model'

import { LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useConfirmModalStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { ISOFormatString } from '@/shared/type'

import * as S from './styles'

export type GroupChallenge = {
  id: number
  name: string
  description: string
  startDate: ISOFormatString
  endDate: ISOFormatString
  imageUrl: string
  currentParticipantCount: number
  category: ChallengeCategoryType

  leafReward?: number // 생성한 챌린지에는 없음
}

interface GroupChallengeCardProps {
  data: GroupChallenge

  isAuth: boolean // 본인의 챌린지인지 여부

  deleteCallback?: () => void // 삭제 후 실행 콜백

  className?: string
}

export const GroupChallengeCard = ({
  data,
  isAuth = false,
  deleteCallback,
  className,
}: GroupChallengeCardProps): ReactNode => {
  const router = useRouter()
  const { isLoggedIn } = useUserStore()
  const { toast } = useToast()
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
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value()),
      })
      return
    }
    // 2. 참여자 여부 확인 (없어야 함)
    if (currentParticipantCount) {
      toast('Error', `이미 참여자가 있는 챌린지는\n수정할 수 없습니다!`)
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
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value()),
      })
      return
    }
    // 2. 참여자 여부 확인 (없어야 함)
    if (currentParticipantCount) {
      toast('Error', `이미 참여자가 있는 챌린지는\n삭제할 수 없습니다!`)
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
              toast('Success', '챌린지가 삭제되었습니다')
            },
          },
        ),
    })
  }

  const { id, imageUrl, name, description, currentParticipantCount, category, leafReward } = data
  const KOR_category = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) // 카테고리를 한글로 변경

  return (
    <S.ChallengeCard onClick={() => handleShowDetails(id)}>
      <S.TopImageWrapper>
        <S.ChallengeImage
          src={imageUrl}
          alt='챌린지 이미지'
          fill
          sizes='(max-width: 900px) 100vw, 400px'
          loading={isAuth ? 'eager' : 'lazy'}
        />
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
