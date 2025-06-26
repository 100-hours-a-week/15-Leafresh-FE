import styled from '@emotion/styled'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
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

export const StyledInput = styled.input<{ isFocused: boolean }>`
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lfLightGray.base};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  outline: none;

  &::placeholder {
    color: transparent;
  }
`

export const Underline = styled.div<{ isFocused: boolean }>`
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.lfBlack.base};
  transform: scaleX(${({ isFocused }) => (isFocused ? 1 : 0)});
  transform-origin: center;
  transition: transform 0.3s ease;
`
