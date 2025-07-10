import styled from '@emotion/styled'

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

export const CurrentMonth = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
`
