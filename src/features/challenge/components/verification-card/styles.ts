import Image from 'next/image'

import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`
export const ProfileWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(2, auto);
  column-gap: 8px;
  align-items: center;
`

export const ProfileImage = styled(Image)`
  grid-row: span 2;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  object-fit: cover;
`

export const ProfileDescriptions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
`

export const Nickname = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const CreatedTime = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

export const VerificationWrapper = styled.div`
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

export const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 5 / 3;
  overflow: hidden;
`

export const VerificationImage = styled(Image)`
  /* width: 100%; */
  object-fit: cover;
  object-position: center;
`

export const Badge = styled.div`
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

export const DescriptionWrapper = styled.div`
  padding: 12px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`
export const Description = styled.div`
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

export const InteractionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const Interaction = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const LikeInteraction = styled(Interaction)<{ isLiked: boolean }>`
  cursor: pointer;

  &:hover img {
    filter: ${({ isLiked }) =>
      isLiked
        ? 'brightness(0.9) saturate(150%) hue-rotate(-10deg)' // 삭제를 의미하는 hover (붉은기)
        : 'brightness(1.4) saturate(180%) hue-rotate(90deg)'}; // 추가를 의미하는 hover (녹색기)
    transition: filter 0.2s ease;
  }
`

export const InteractionCount = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
`

export const ViewWrapper = styled.div`
  margin-left: auto;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
`
