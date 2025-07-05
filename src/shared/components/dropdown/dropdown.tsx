'use client'

import { cloneElement, isValidElement, useRef } from 'react'
import { ReactElement, ReactNode } from 'react'

import { useOutsideClick, useToggle } from '@/shared/hooks'

import { DropdownContext, useDropdownContext } from './dropdown-context'
import * as S from './style'

interface DropdownProps<T> {
  children: ReactNode
  selected: T | undefined // 아직 선택되지 않은 경우 undefined
  onSelect: (value: T) => void
}

export const Dropdown = <T,>({ children, selected, onSelect }: DropdownProps<T>) => {
  const { value: isOpen, toggle, setValue } = useToggle(false)

  // 외부 클릭시 닫기
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref as React.RefObject<HTMLElement>, () => setValue(false))

  return (
    <DropdownContext.Provider
      value={{
        selected,
        onSelect,
        isOpen,
        toggle,
      }}
    >
      <S.Wrapper ref={ref}>{children}</S.Wrapper>
    </DropdownContext.Provider>
  )
}

interface TriggerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as: ReactElement<any>
}

/**
 * 드롭다운 트리거 요소
 * @param as 드롭다운 트리거 컴포넌트
 */
const Trigger = ({ as }: TriggerProps) => {
  const { toggle } = useDropdownContext()

  if (!isValidElement(as)) return null

  const child = as as ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>

  return cloneElement(child, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(e)
      toggle()
    },
  })
}

interface MenuProps {
  children: ReactNode
  maxVisibleCount?: number
}

/**
 * 열린 드롭다운의 영역
 */
const Menu = ({ children, maxVisibleCount = 4 }: MenuProps) => {
  const { isOpen } = useDropdownContext()
  if (!isOpen) return null

  return <S.MenuWrapper maxHeight={maxVisibleCount * 40}>{children}</S.MenuWrapper>
}

interface ItemProps<T> {
  value: T
  children: ReactNode
}

/**
 * 하나의 드롭다운
 */
const Item = <T,>({ value, children }: ItemProps<T>) => {
  const { onSelect, toggle } = useDropdownContext()

  const handleClick = () => {
    onSelect(value)
    toggle()
  }

  const child = children as ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>

  return cloneElement(child, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(e)
      handleClick()
    },
  })
}

Dropdown.Trigger = Trigger
Dropdown.Menu = Menu
Dropdown.Item = Item
