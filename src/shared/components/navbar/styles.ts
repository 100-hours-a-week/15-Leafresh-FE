import styled from '@emotion/styled'

export const NavbarWrapper = styled.nav`
  min-width: 300px;
  max-width: 430px;
  width: 100%;

  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  right: 0;

  display: grid;
  grid-template-columns: repeat(5, 1fr);

  height: 72px;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-top: 1px solid ${({ theme }) => theme.colors.lfLightGray.base};

  z-index: 99;
`

export const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;

  background: none;
  border: none;
  cursor: pointer;
`

export const Label = styled.span<{ active: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-top: 4px;
  color: ${({ active, theme }) => (active ? theme.colors.lfBlack.base : theme.colors.lfGray.base)};
`
