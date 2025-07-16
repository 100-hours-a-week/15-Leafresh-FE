import styled from '@emotion/styled'

import { LogoImage } from '@/shared/assets'
import { LucideIcon } from '@/shared/components'

export const HeaderContainer = styled.header`
  width: 100%;
  height: 60px;
  flex-shrink: 0;

  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lfLightGray.base};
`

export const CustomWidthWrapper = styled.div<{ padding: number }>`
  width: 100%;
  padding: ${({ padding }) => `0px ${padding}px`};
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const LogoWrapper = styled.div`
  cursor: pointer;
`

export const StyledImage = styled(LogoImage)`
  height: 40px;
  width: auto;
`

export const MenuButtons = styled.button`
  position: absolute;
  right: 35px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;

  background: none;
  border: none;
  cursor: pointer;
`

export const AlarmButton = styled(LucideIcon)``
