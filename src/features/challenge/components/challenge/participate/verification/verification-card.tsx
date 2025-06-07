import Image from 'next/image'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/constant'
import { Verification } from '@features/challenge/api/participate/get-group-participant-list'
import { getTimeDiff } from '@shared/lib/date/utils'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import ActiveLikeIcon from '@public/icon/like_active.svg'
import InActiveLikeIcon from '@public/icon/like_inactive.svg'

interface VerificationCardProps {
  data: Verification
  className?: string
}

const VerificationCard = ({ data, className }: VerificationCardProps): ReactNode => {
  // 인증 정보
  const { id, description, category, counts, createdAt, verificationImageUrl } = data
  const { comment, like, view } = counts
  // 사용자 정보
  const { nickname, isLiked, profileImageUrl } = data

  // 가공 정보
  const createdTime = getTimeDiff(createdAt)
  const category_kor = convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) // 카테고리를 한글로 변경
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
          <VerificationImage src={verificationImageUrl} alt='인증 이미지' width={150} height={150} />
          <Badge className='badge'>{category_kor}</Badge>
        </ImageWrapper>

        <DescriptionWrapper>
          <Description>{description}</Description>

          <InteractionWrapper>
            <Interaction>
              {/* TODO: 좋아요 기능 구현 여부  */}
              <LikeImage src={isLiked ? ActiveLikeIcon : InActiveLikeIcon} alt='좋아요' />
              <InteractionCount>{like}</InteractionCount>
            </Interaction>
            <Interaction>
              <LucideIcon name='MessageCircle' size={24} strokeWidth={1.8} />
              <InteractionCount>{comment}</InteractionCount>
            </Interaction>
            <LucideIcon name='SquareArrowOutUpRight' size={24} strokeWidth={1.8} />
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
  width: 100%;
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
