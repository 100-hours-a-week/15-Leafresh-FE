'use client'

import styled from '@emotion/styled'

export const InputWrapper = styled.div`
  width: 100%;

  position: relative;
  cursor: pointer;
  min-width: 120px;
`

export const Label = styled.label<{ isFocused: boolean }>`
  position: absolute;
  top: ${({ isFocused }) => (isFocused ? '-20px' : '50%')};
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

export const SelectedText = styled.span`
  flex-grow: 1;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const SelectBox = styled.div<{ isFocused: boolean }>`
  width: 100%;
  height: 100%;
  padding: 6px 8px;

  border-bottom: 2px solid ${({ theme }) => theme.colors.lfLightGray.base};
  background: transparent;
  cursor: pointer;
  position: relative;

  display: flex;
  justify-content: flex-end;
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

export const IconWrapper = styled.div<{ isFocused: boolean }>`
  transform: rotate(${({ isFocused }) => (isFocused ? 180 : 0)}deg);
  transition: transform 0.3s ease;
`
