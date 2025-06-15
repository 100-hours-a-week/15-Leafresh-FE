import NoContent from '@shared/components/no-content/ui/no-content'
import { responsiveHorizontalPadding } from '@shared/styles/responsive-style'

import styled from '@emotion/styled'

export const Wrapper = styled.section<{ isLoading: boolean }>`
  ${responsiveHorizontalPadding};
  margin-top: 24px;

  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: ${({ isLoading }) => (isLoading ? 'center' : 'flex-start')};
  gap: 28px;
`
export const StyledNoContent = styled(NoContent)`
  margin: 60px 0;
`

export const ObserverTrigger = styled.div`
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
