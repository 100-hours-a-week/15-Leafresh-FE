import styled from '@emotion/styled'

export const DateWrapper = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
`

export const DateText = styled.div<{ isValid: boolean }>`
  width: 100%;
  height: 100%;
  padding: 10px 0;

  position: relative;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ isValid, theme }) => (isValid ? theme.colors.lfBlack.base : theme.colors.lfDarkGray.base)};

  &::before {
    content: '';
    position: absolute;
    left: 0px;
    bottom: -2px;
    transform-origin: center;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.lfBlack.base};
    transition: transform 0.3s ease;
  }
`

export const Tilde = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`
