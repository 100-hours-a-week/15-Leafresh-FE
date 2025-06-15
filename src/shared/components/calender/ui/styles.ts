import styled from '@emotion/styled'

export const Wrapper = styled.div`
  width: 100%;
  max-width: 280px;
  min-width: 260px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
`
