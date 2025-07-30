import { ReactElement, ReactNode } from 'react'

export interface DropdownProps<T> {
  initialOpen?: boolean

  onSelect?: (value: T) => void
  className?: string
  children: ReactNode
}

export interface TriggerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: ReactElement<any>
}
export interface InjectedTriggerProps {
  isOpen?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
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

export interface ComponentProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: ReactElement<any>
}
export interface InjectedComponentProps {
  isOpen?: boolean
  toggle?: () => void
}
