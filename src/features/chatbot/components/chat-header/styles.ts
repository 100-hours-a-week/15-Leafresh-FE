import styled from '@emotion/styled'
export const HeaderWrapper = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: #f5fff2;
  border-bottom: solid 1px ${({ theme }) => theme.colors.lfBlack.base};
`

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`
export const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`
