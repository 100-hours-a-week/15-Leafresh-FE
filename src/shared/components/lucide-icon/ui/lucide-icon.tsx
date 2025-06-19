'use client'
import { icons } from 'lucide-react'

import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { ThemeColorType } from '@shared/config/style/type'
import { getThemeColor } from '@shared/lib/utils/theme-utils'

export interface LucideIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  name: keyof typeof icons
  color?: ThemeColorType
  fill?: ThemeColorType
  size?: number
  strokeWidth?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (...args: any[]) => void
  ref?: React.Ref<HTMLDivElement>
  className?: string
}

export const LucideIcon = ({
  name,
  color = 'lfBlack',
  fill,
  size = 16,
  strokeWidth = 2,
  onClick,
  ref,
  className,
  ...props
}: LucideIconProps) => {
  const Icon = icons[name]

  return (
    <Wrapper ref={ref} onClick={onClick} className={className}>
      <StyledIcon
        as={Icon}
        color={color ? getThemeColor(color) : undefined}
        fill={fill ? getThemeColor(fill) : 'transparent'}
        strokeWidth={strokeWidth}
        size={size}
        hasClick={!!onClick}
        {...props}
      />
    </Wrapper>
  )
}

// === Styles ===

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const StyledIcon = styled('svg', {
  shouldForwardProp: prop => isPropValid(prop) && prop !== 'hasClick',
})<{ size: number; hasClick: boolean }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  ${({ hasClick }) => hasClick && 'cursor: pointer;'}
`
