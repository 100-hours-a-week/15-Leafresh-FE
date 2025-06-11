import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'

import styled from '@emotion/styled'

export const PageWrapper = styled.div`
  ${responsiveHorizontalPadding};

  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 480px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
`
