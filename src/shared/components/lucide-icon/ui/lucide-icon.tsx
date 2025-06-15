'use client'
import { icons } from 'lucide-react'

import { ThemeColorType } from '@shared/config/style/type'
import { getThemeColor } from '@shared/lib/utils/theme-utils'

import * as S from './styles'

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
    <S.Wrapper ref={ref} onClick={onClick} className={className}>
      <S.StyledIcon
        as={Icon}
        color={color ? getThemeColor(color) : undefined}
        fill={fill ? getThemeColor(fill) : 'transparent'}
        strokeWidth={strokeWidth}
        size={size}
        hasClick={!!onClick}
        {...props}
      />
    </S.Wrapper>
  )
}
