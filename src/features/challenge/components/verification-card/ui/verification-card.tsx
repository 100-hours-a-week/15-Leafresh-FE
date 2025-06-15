import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'

import {
  CreateVerificationLikeResponse,
  CreateVerificationLikeVariables,
} from '@entities/challenge/api/group/verification/likes/create-like'
import {
  DeleteVerificationLikeResponse,
  DeleteVerificationLikeVariables,
} from '@entities/challenge/api/group/verification/likes/delete-like'
import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/model'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route'
import { useConfirmModalStore } from '@shared/context/modal/confirm-modal-store'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/use-auth/useAuth'
import { useToast } from '@shared/hooks/use-toast/useToast'
import { getTimeDiff } from '@shared/lib/date/utils'
import { copyToClipboard } from '@shared/lib/ui/copy-clipboard'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import ActiveLikeIcon from '@public/icon/like_active.svg'
import InActiveLikeIcon from '@public/icon/like_inactive.svg'

import { VerificationCardProps } from '../model/types'
import * as S from './stlyes'

export const VerificationCard = ({ challengeId, verificationData, className }: VerificationCardProps): ReactNode => {
  const router = useRouter()
  const openToast = useToast()
  const { openConfirmModal } = useConfirmModalStore()
  const { isLoggedIn } = useAuth()

  // 인증 정보
  const { id: verificationId, description, category, counts, createdAt, verificationImageUrl } = verificationData
  const { comment, like, view } = counts
  // 사용자 정보
  const { nickname, isLiked: initiallyLiked, profileImageUrl } = verificationData

  // 가공 정보
  const createdTime = getTimeDiff(createdAt)
  const category_kor = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) // 카테고리를 한글로 변경

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState<boolean>(initiallyLiked)
  const [likesCount, setLikesCount] = useState<number>(like)

  /** 좋아요 추가 API */
  const { mutate: likeMutate } = useMutationStore<CreateVerificationLikeResponse, CreateVerificationLikeVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.LIKES.CREATE,
  )
  /** 좋아요 삭제 API */
  const { mutate: unlikeMutate } = useMutationStore<DeleteVerificationLikeResponse, DeleteVerificationLikeVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.LIKES.DELETE,
  )

  /** 좋아요 핸들러 */
  const toggleLike = () => {
    // #0. 로그인 상태가 아닐 때
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }
    // 롤백용 현재 상태
    const prevLiked = isLiked
    const prevCount = likesCount

    // 낙관적 업데이트
    setIsLiked(!prevLiked)
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1)

    const mutationFn = prevLiked ? unlikeMutate : likeMutate
    const params = { challengeId, verificationId }
    mutationFn(params, {
      onError: () => {
        // 실패하면 rollback
        setIsLiked(prevLiked)
        setLikesCount(prevCount)

        openToast(ToastType.Error, '좋아요 처리 중 오류가 발생했습니다.')
      },
    })
  }

  /** 클립보드 복사 */
  const handleCopyVerificationUrl = () => {
    const url = `${window.location.origin}${URL.CHALLENGE.GROUP.VERIFICATION.LIST.value(challengeId)}`
    copyToClipboard(url)
  }
  return (
    <S.Wrapper className={className}>
      <S.HeaderWrapper>
        <S.ProfileWrapper>
          <S.ProfileImage src={profileImageUrl} alt='프로필' width={40} height={40} />
          <S.ProfileDescriptions>
            <S.Nickname>{nickname}</S.Nickname>
            <S.CreatedTime>{createdTime}</S.CreatedTime>
          </S.ProfileDescriptions>
        </S.ProfileWrapper>
      </S.HeaderWrapper>

      <S.VerificationWrapper>
        <S.ImageWrapper>
          <S.VerificationImage src={verificationImageUrl} alt='인증 이미지' fill />
          <S.Badge className='badge'>{category_kor}</S.Badge>
        </S.ImageWrapper>

        <S.DescriptionWrapper>
          <S.Description>{description}</S.Description>

          <S.InteractionWrapper>
            <S.LikeInteraction isLiked={isLiked} onClick={toggleLike}>
              <motion.img
                key={isLiked ? 'liked' : 'unliked'}
                src={isLiked ? ActiveLikeIcon.src : InActiveLikeIcon.src}
                alt='좋아요'
                width={24}
                height={24}
                initial={isLiked ? { scale: 1.4 } : false} // 좋아요 추가일 때만 애니메이션
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 0.5 }}
              />
              <S.InteractionCount>{likesCount}</S.InteractionCount>
            </S.LikeInteraction>
            <S.Interaction>
              <LucideIcon name='MessageCircle' size={24} strokeWidth={1.8} />
              <S.InteractionCount>{comment}</S.InteractionCount>
            </S.Interaction>
            <LucideIcon name='SquareArrowOutUpRight' size={24} strokeWidth={1.8} onClick={handleCopyVerificationUrl} />
            <S.ViewWrapper>조회수 {view}</S.ViewWrapper>
          </S.InteractionWrapper>
        </S.DescriptionWrapper>
      </S.VerificationWrapper>
    </S.Wrapper>
  )
}
