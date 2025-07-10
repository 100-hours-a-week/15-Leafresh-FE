import styled from '@emotion/styled'

export const LeafWrapper = styled.p`
  position: absolute;
  z-index: 20;

  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const LeafLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
