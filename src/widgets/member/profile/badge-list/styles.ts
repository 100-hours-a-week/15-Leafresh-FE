import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: ${({ theme }) => theme.colors.lfWhite.base};
  /*  */
`

export const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  margin: 0;
`
