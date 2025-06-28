import styled from '@emotion/styled'

export const Wrapper = styled.div`
  width: 200px;
  position: relative;
`

export const Label = styled.label<{ isFocused: boolean }>`
  position: absolute;
  top: ${({ isFocused }) => (isFocused ? '-12px' : '50%')};
  transform: translateY(${({ isFocused }) => (isFocused ? '0' : '-50%')});

  font-size: ${({ isFocused, theme }) => (isFocused ? theme.fontSize.xs : theme.fontSize.sm)};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  color: ${({ theme }) => theme.colors.lfBlack.base};
  transition: all 0.2s ease;
  pointer-events: none;
`

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.lfGreenBorder.base};
  margin-left: 4px;
`

export const SelectBox = styled.div<{ isFocused: boolean }>`
  padding: 6px 8px;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lfLightGray.base};
  background: transparent;
  cursor: pointer;
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%) scaleX(${({ isFocused }) => (isFocused ? 1 : 0)});
    transform-origin: center;
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.lfBlack.base};
    transition: transform 0.3s ease;
  }
`

export const SelectedText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const IconWrapper = styled.div<{ isFocused: boolean }>`
  transform: rotate(${({ isFocused }) => (isFocused ? 180 : 0)}deg);
  transition: transform 0.3s ease;
`

export const DropdownBox = styled.ul<{ maxHeight: number }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: ${({ maxHeight }) => maxHeight}px;
  overflow-y: auto;
  margin-top: 8px;
  padding: 8px 4px;
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  z-index: 10;
  list-style: none;
`

export const Item = styled.li<{ isHovered: boolean }>`
  padding: 12px 4px;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.regular};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  background-color: ${({ isHovered, theme }) => (isHovered ? theme.colors.lfLightGray.base : 'transparent')};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background-color 0.2s ease;
`
