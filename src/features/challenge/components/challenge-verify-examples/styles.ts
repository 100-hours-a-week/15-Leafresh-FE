import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const Label = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.lfGreenBorder.base};
`

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.lfGreenMain.base};
`

export const ScrollArea = styled.div`
  width: 100%;

  position: relative;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
`
