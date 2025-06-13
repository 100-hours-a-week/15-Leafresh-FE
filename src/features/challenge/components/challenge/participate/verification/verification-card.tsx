import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'

import { Verification } from '@entities/challenge/api/participate/get-group-participant-list'
import {
  CreateVerificationLikeResponse,
  CreateVerificationLikeVariables,
} from '@entities/challenge/api/participate/verification/likes/create-like'
import {
  DeleteVerificationLikeResponse,
  DeleteVerificationLikeVariables,
} from '@entities/challenge/api/participate/verification/likes/delete-like'
import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/model/consts'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import { getTimeDiff } from '@shared/lib/date/utils'
import { copyToClipboard } from '@shared/lib/ui/copy-clipboard'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import ActiveLikeIcon from '@public/icon/like_active.svg'
import InActiveLikeIcon from '@public/icon/like_inactive.svg'

import styled from '@emotion/styled'

interface VerificationCardProps {
  challengeId: number
  verificationData: Verification
  className?: string
}

const VerificationCard = ({ challengeId, verificationData, className }: VerificationCardProps): ReactNode => {
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
    <Wrapper className={className}>
      <HeaderWrapper>
        <ProfileWrapper>
          <ProfileImage src={profileImageUrl} alt='프로필' width={40} height={40} />
          <ProfileDescriptions>
            <Nickname>{nickname}</Nickname>
            <CreatedTime>{createdTime}</CreatedTime>
          </ProfileDescriptions>
        </ProfileWrapper>
      </HeaderWrapper>

      <VerificationWrapper>
        <ImageWrapper>
          <VerificationImage src={verificationImageUrl} alt='인증 이미지' fill />
          <Badge className='badge'>{category_kor}</Badge>
        </ImageWrapper>

        <DescriptionWrapper>
          <Description>{description}</Description>

          <InteractionWrapper>
            <LikeInteraction isLiked={isLiked} onClick={toggleLike}>
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
              <InteractionCount>{likesCount}</InteractionCount>
            </LikeInteraction>
            <Interaction>
              <LucideIcon name='MessageCircle' size={24} strokeWidth={1.8} />
              <InteractionCount>{comment}</InteractionCount>
            </Interaction>
            <LucideIcon name='SquareArrowOutUpRight' size={24} strokeWidth={1.8} onClick={handleCopyVerificationUrl} />
            <ViewWrapper>조회수 {view}</ViewWrapper>
          </InteractionWrapper>
        </DescriptionWrapper>
      </VerificationWrapper>
    </Wrapper>
  )
}

export default VerificationCard

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`
const ProfileWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(2, auto);
  column-gap: 8px;
  align-items: center;
`

const ProfileImage = styled(Image)`
  grid-row: span 2;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
`

const ProfileDescriptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
`

const Nickname = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

const CreatedTime = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

const VerificationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  border-radius: ${({ theme }) => theme.radius.md};

  overflow: hidden;
  cursor: pointer;

  &:hover {
    .badge {
      opacity: 1;
    }
  }
`

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 5 / 3;
  overflow: hidden;
`

const VerificationImage = styled(Image)`
  /* width: 100%; */
  object-fit: cover;
  object-position: center;
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

const DescriptionWrapper = styled.div`
  padding: 12px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`
const Description = styled.div`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: 450;

  display: -webkit-box;
  -webkit-line-clamp: 2; // 최대 2줄
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: normal;
`

const InteractionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

const Interaction = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const LikeInteraction = styled(Interaction)<{ isLiked: boolean }>`
  cursor: pointer;

  &:hover img {
    filter: ${({ isLiked }) =>
      isLiked
        ? 'brightness(0.9) saturate(150%) hue-rotate(-10deg)' // 삭제를 의미하는 hover (붉은기)
        : 'brightness(1.4) saturate(180%) hue-rotate(90deg)'}; // 추가를 의미하는 hover (녹색기)
    transition: filter 0.2s ease;
  }
`

const InteractionCount = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
`

const ViewWrapper = styled.div`
  margin-left: auto;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
`

const LikeImage = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`
