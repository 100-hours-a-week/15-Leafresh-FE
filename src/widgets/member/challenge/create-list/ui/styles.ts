import styled from '@emotion/styled'

import NoContent from '@shared/components/no-content/no-content'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

export const Wrapper = styled.div`
  ${responsiveHorizontalPadding};

  width: 100%;
  height: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
`

export const ChallengeList = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const Observer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
`

export const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

export const StyledNoContent = styled(NoContent)`
  height: 100%;
`
