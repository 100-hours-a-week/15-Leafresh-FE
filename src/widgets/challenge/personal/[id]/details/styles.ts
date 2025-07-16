import Image from 'next/image'

import styled from '@emotion/styled'

import { ChallengeVerifyExamples } from '@/features/challenge/components'

import { LeafReward } from '@/shared/components'
import { ASPECT_RATIO } from '@/shared/constants'
import { responsiveHorizontalPadding } from '@/shared/styles'

export const Wrapper = styled.div`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const DescriptionSection = styled.section`
  margin-bottom: 45px;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ThumbnailImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: ${ASPECT_RATIO.CHALLENGE.THUMBNAIL};

  position: relative;
`
export const Thumbnail = styled(Image)`
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.base};
`

export const Descriptions = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Title = styled.h2`
  font-size: 30px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  white-space: pre-wrap;
  word-break: break-word;
`

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;

  gap: 12px;
`

export const SectionTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  position: relative;
`

export const TimeArea = styled.div`
  background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
  border-radius: ${({ theme }) => theme.radius.sm};

  margin-top: 16px;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const TimeText = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.base};
`

export const StyledChallengeVerifyExamples = styled(ChallengeVerifyExamples)`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  .verify-input {
    width: 40%;
  }
`

export const SubmitButton = styled.button`
  /* padding: 12px; */
  height: 50px;
  border-radius: ${({ theme }) => theme.radius.base};
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.colors.lfGreenInactive.base : theme.colors.lfGreenMain.base};
  color: ${({ disabled, theme }) => (disabled ? theme.colors.lfBlack.base : theme.colors.lfWhite.base)};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: none;

  &:hover {
    background-color: ${({ disabled, theme }) =>
      disabled ? theme.colors.lfGreenInactive.base : theme.colors.lfGreenMain.hover};
  }
`

export const WarningList = styled.ul`
  margin-top: 5px;

  font-size: ${({ theme }) => theme.fontSize.base};
  display: flex;
  flex-direction: column;
  gap: 15px;
`

export const Warning = styled.div<{ isWarning: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;

  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ isWarning, theme }) => (isWarning ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};
`

export const StyledLeafReward = styled(LeafReward)`
  margin-left: 8px;
  position: relative;
`
