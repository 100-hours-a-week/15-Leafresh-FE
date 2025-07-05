import { ReactElement, ReactNode } from 'react'

export interface DropdownProps<T> {
  children: ReactNode

  selected: T | undefined // 아직 선택되지 않은 경우 undefined
  onSelect: (value: T) => void
}

export interface TriggerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: ReactElement<any>
}
export interface InjectedTriggerProps {
  isOpen?: boolean
  toggle?: () => void
}

export interface MenuProps {
  children: ReactNode
  maxVisibleCount?: number
}

export interface ItemProps<T> {
  value: T
  children: ReactNode
}
export interface InjectedItemProps {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}
