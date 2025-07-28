import styled from '@emotion/styled'

import { LucideIcon } from '@/shared/components'

export const Container = styled.div`
  position: absolute;
  bottom: 90px;
  left: 16px;

  pointer-events: none;
  z-index: 999;

  display: flex;
  justify-content: center;

  width: 48px;
  aspect-ratio: 1/1;
`
export const ButtonIcon = styled(LucideIcon)`
  width: 100%;
  height: 100%;
  pointer-events: auto;

  position: relative;

  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
`
