import { createContext, useContext } from 'react'

/**
 * 드롭다운 내부에서 관리하는 값/함수
 */
interface DropdownContextType<F> {
  onSelect: F

  isOpen: boolean
  toggle: () => void
}

export const DropdownContext = createContext<DropdownContextType<unknown> | null>(null)

export function useDropdownContext<F extends (...args: unknown[]) => unknown>() {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('Dropdown compound component cannot be rendered outside Dropdown')
  return context as DropdownContextType<F>
}
