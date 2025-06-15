import styled from '@emotion/styled'

export const EmptySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`

export const EmptyTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  margin: 16px 0 16px 0;
`

export const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};

  margin-top: 6px;
  text-align: center;

  white-space: pre-wrap;
  word-break: break-word;
`
