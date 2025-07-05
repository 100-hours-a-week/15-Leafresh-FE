'use client'

import { cloneElement, isValidElement, useRef } from 'react'
import { ReactElement } from 'react'

import { useKeyClose, useOutsideClick, useToggle } from '@/shared/hooks'

import { DropdownContext, useDropdownContext } from './dropdown-context'
import * as S from './style'
import { DropdownProps, InjectedItemProps, InjectedTriggerProps, ItemProps, MenuProps, TriggerProps } from './types'

export const Dropdown = <T,>({ children, selected, onSelect }: DropdownProps<T>) => {
  const { value: isOpen, toggle, setValue } = useToggle(false)

  // 외부 클릭시 닫기
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref as React.RefObject<HTMLElement>, () => setValue(false))
  useKeyClose('Escape', ref as React.RefObject<HTMLElement>, () => setValue(false))

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

/**
 * 드롭다운 트리거 요소
 * @param as 드롭다운 트리거 컴포넌트
 */
const Trigger = ({ as }: TriggerProps) => {
  const { isOpen, toggle } = useDropdownContext()

  if (!isValidElement(as)) return null

  const child = as as ReactElement<InjectedTriggerProps>

  return cloneElement(child, {
    isOpen,
    toggle,
  })
}

/**
 * 열린 드롭다운의 영역
 */
const Menu = ({ children, maxVisibleCount = 4 }: MenuProps) => {
  const { isOpen } = useDropdownContext()
  if (!isOpen) return null

  return <S.MenuWrapper maxHeight={maxVisibleCount * 40}>{children}</S.MenuWrapper>
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

  const child = children as ReactElement<InjectedItemProps>

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
