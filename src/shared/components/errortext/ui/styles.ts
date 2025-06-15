import styled from '@emotion/styled'
export const Text = styled.p`
  margin-top: 6px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfRed.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`
