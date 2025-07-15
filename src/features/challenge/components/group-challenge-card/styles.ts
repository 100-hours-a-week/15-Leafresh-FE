import styled from '@emotion/styled'

import { LeafReward } from '@/shared/components'
import { ASPECT_RATIO } from '@/shared/constants'

export const ChallengeCard = styled.div`
  width: 100%;
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

export const TopImageWrapper = styled.div`
  background: #d9d9d9;
  width: 100%;
  aspect-ratio: ${ASPECT_RATIO.CHALLENGE.THUMBNAIL};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
`

export const ChallengeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${ChallengeCard}:hover & {
    transform: scale(1.05); // ✅ 1.1배 확대
  }
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

export const CardBody = styled.div`
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ChallengeName = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const ActionButtons = styled.div`
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.sm};
  gap: 8px;
`

export const ModifyButton = styled.button`
  color: ${({ theme }) => theme.colors.lfBlack.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.lfBlue.base};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }
`

export const DeleteButton = styled.button`
  color: ${({ theme }) => theme.colors.lfRed.base};
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.lfRed.hover};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }
`

export const ChallengeDesc = styled.div`
  margin: 10px 0 16px 0;
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ParticipantCount = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlue.base};
`

export const StyledLeafReward = styled(LeafReward)`
  bottom: 4%;
  right: 9%;
`
