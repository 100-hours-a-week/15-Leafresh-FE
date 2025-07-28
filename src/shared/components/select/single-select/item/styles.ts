import styled from '@emotion/styled'

export const OptionWrapper = styled.li`
  padding: 12px 4px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfLightGray.base};
  }
`
