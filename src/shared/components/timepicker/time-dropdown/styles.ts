import styled from '@emotion/styled'

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

export const Trigger = styled.button`
  width: 100%;
  appearance: none;
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  text-align: start;
  cursor: pointer;
`

export const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 15px);
  width: 100%;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  color: ${({ theme }) => theme.colors.lfDarkGray};
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};

  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    visibility 0s linear ${({ isOpen }) => (isOpen ? '0s' : '0.2s')};
`

export const Columns = styled.div`
  display: flex;
  position: relative;
`
export const Column = styled.ul`
  width: 50%;
  max-height: 150px;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.colors.lfBlue};
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 3px;
  }
`
export const Option = styled.li<{ selected: boolean }>`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  background: ${({ selected, theme }) => (selected ? theme.colors.lfGreenMain.hover : theme.colors.lfWhite.base)};
  color: ${({ selected, theme }) => (selected ? theme.colors.lfWhite.base : theme.colors.lfGray.base)};
  &:hover {
    background: ${({ theme }) => theme.colors.lfGreenInactive.base};
    color: ${({ theme }) => theme.colors.lfDarkGray.base};
  }
`
export const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`
export const ActButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 8px 0;
  background: ${({ primary, theme }) => (primary ? theme.colors.lfGreenMain.base : 'transparent')};
  color: ${({ primary, theme }) => (primary ? theme.colors.lfWhite.base : theme.colors.lfBlack.base)};
  border: none;

  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  cursor: pointer;
  &:hover {
    background: ${({ primary, theme }) => (primary ? theme.colors.lfGreenMain.hover : theme.colors.lfLightGray.base)};
  }
`
