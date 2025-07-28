import styled from '@emotion/styled'

import { NoContentFeedback } from '@/shared/components'
import { responsiveHorizontalPadding } from '@/shared/styles'

export const Wrapper = styled.div`
  height: 100%;

  ${responsiveHorizontalPadding};

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;
`
export const ChallengeDataWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;

  font-size: ${({ theme }) => theme.fontSize.lg};
`

export const Title = styled.h1`
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lfDarkGray.base};
`

export const Participant = styled.div`
  margin-top: 12px;
  align-self: flex-end;

  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlue.base};

  display: flex;
  align-items: center;
  gap: 5px;
`

export const ContentsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 28px;
`

export const ObserverTrigger = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
`

export const StyledNoContentFeedback = styled(NoContentFeedback)`
  height: 100%;
`

export const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
