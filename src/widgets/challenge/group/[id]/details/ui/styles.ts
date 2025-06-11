import Image from 'next/image'

import styled from '@emotion/styled'

import ChallengeVerifyExamples from '@features/challenge/components/common/ChallengeVerifyExamples'
import BackButton from '@shared/components/button/BackButton'
import DatePicker from '@shared/components/datepicker/DatePicker'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'
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
  aspect-ratio: 14/9;

  position: relative;
`

export const Thumbnail = styled(Image)`
  width: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.base};
`

export const Participant = styled.div`
  padding: 14px 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlue.base};

  display: flex;
  align-items: center;
  gap: 5px;
`

export const Descriptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Title = styled.h2`
  font-size: 30px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
`

export const MoreButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfBlue.base};
  background: none;
  border: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
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

export const StyledDatePicker = styled(DatePicker)`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.md};
`

export const TimeArea = styled.div`
  background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
  border-radius: ${({ theme }) => theme.radius.sm};

  margin-top: 18px;
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

export const StyledBackButton = styled(BackButton)`
  position: absolute;
`

export const NoVerficiationImageText = styled.div`
  text-align: center;
  padding: 30px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfRed.base};
`
