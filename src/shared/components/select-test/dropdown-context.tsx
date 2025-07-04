import { createContext, useContext } from 'react'

/**
 * 드롭다운 내부에서 관리하는 값/함수
 */
interface DropdownContextType<T> {
  selected: T
  onSelect: (value: T) => void

  isOpen: boolean
  toggle: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DropdownContext = createContext<DropdownContextType<any> | null>(null)

export function useDropdownContext<T>() {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('Dropdown compound component cannot be rendered outside Dropdown')
  return context as DropdownContextType<T>
}
