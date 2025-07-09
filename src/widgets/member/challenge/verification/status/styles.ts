import styled from '@emotion/styled'

import { responsiveHorizontalPadding } from '@/shared/styles'

export const CarouselWrapper = styled.div`
  width: 100%;

  position: relative;
`
export const Container = styled.div`
  ${responsiveHorizontalPadding};

  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`
export const Title = styled.h2`
  align-self: center;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const Stats = styled.div`
  padding: 0 20px;

  display: flex;
  justify-content: space-between;
`

export const Stat = styled.div`
  text-align: center;
`
export const Label = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
export const Count = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-top: 4px;
`
export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ActionButton = styled.button`
  padding: 12px;
  background: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSize.md};
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
export const DisabledButton = styled.button`
  padding: 12px;
  background: ${({ theme }) => theme.colors.lfGreenInactive.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSize.md};
  cursor: default;
`
export const Message = styled.div`
  padding: 40px;
  text-align: center;
`

export const NoneContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
