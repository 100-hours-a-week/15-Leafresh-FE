import styled from '@emotion/styled'

export const Dates = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const DateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

export const DateCell = styled.div<{
  isCurrentMonth: boolean
  isSelected: boolean
  isInRange: boolean
  isDisabled: boolean
  isSunday: boolean
  isSaturday: boolean
}>`
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  color: ${({ isCurrentMonth, isSelected, isDisabled, isSunday, isSaturday, theme }) => {
    if (!isCurrentMonth || isDisabled) return theme.colors.lfGray.base
    if (isSelected) return theme.colors.lfWhite.base
    if (isSaturday) return theme.colors.lfBlue.base
    if (isSunday) return theme.colors.lfRed.base
    return theme.colors.lfBlack.base
  }};

  background-color: ${({ isSelected, isInRange, theme }) => {
    if (isSelected) return theme.colors.lfGreenMain.base
    if (isInRange) return theme.colors.lfGreenInactive.base
    return 'transparent'
  }};

  border-radius: ${({ theme }) => theme.radius.base};
  ${({ isDisabled }) => (isDisabled ? 'pointer-events: none; opacity: 0.5;' : 'cursor: pointer;')};
`
