import styled from '@emotion/styled'

import { Calendar } from '../calender'
import { ComponentSelect } from '../select'

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.lfGreenBorder.base};
  margin-left: 4px;
`

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`

export const InputArea = styled.div<{ isFocused: boolean; readOnly?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 10px 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lfLightGray.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'pointer')};

  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%) scaleX(${({ isFocused, readOnly }) => (readOnly ? 0 : isFocused ? 1 : 0)});
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

export const DateText = styled.div<{ isValid: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ isValid, theme }) => (isValid ? theme.colors.lfBlack.base : theme.colors.lfDarkGray.base)};
`

export const CalendarWrapper = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + 12px);
`

export const StyledComponentSelect = styled(ComponentSelect)<{ readOnly?: boolean }>`
  flex: 1;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'pointer')};
`

export const StyledCalendar = styled(Calendar)`
  position: absolute;
  top: calc(100% + 20px);

  z-index: 10;
`

export const StyledStartCalendar = styled(StyledCalendar)`
  left: 50%;
  transform: translateX(-50%);
`
