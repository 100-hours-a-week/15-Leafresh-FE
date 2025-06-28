import styled from '@emotion/styled'

export const Container = styled.div<{ tabsCount: number; currentIndex: number }>`
  display: inline-flex;
  width: 100%;
  height: 47px;
  border: 1px solid #ccc;
  border-radius: 24px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(${({ currentIndex }) => currentIndex} * 100% / ${({ tabsCount }) => tabsCount});
    width: calc(100% / ${({ tabsCount }) => tabsCount});
    height: 4px;
    background: ${({ theme }) => theme.colors.lfGreenMain.base};
    transition: left 0.2s ease;
  }
`

export const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  background: ${({ isActive, theme }) => (isActive ? theme.colors.lfGreenMain.base : theme.colors.lfWhite.base)};
  color: ${({ isActive, theme }) => (isActive ? theme.colors.lfWhite.base : theme.colors.lfBlack.base)};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.lfGreenMain.base};
    outline-offset: 2px;
  }
`
