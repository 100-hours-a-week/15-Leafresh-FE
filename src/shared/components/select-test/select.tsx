import { ReactElement, ReactNode } from 'react'

import { Dropdown } from './dropdown-test'

/**
 * T: 선택지의 타입
 * 외부에서 주입해야 하는 값으로 구성됨
 */
interface SelectProps<T> {
  label: string // Select 종류 (이름)

  trigger: ReactElement // 트리거 요소 (고정)
  selected: T | undefined // 선택된 상태 (변동값)
  onSelect: (value: T) => void

  options: T[]
  renderOption: (option: T) => ReactNode // T: object인 경우 대비
}

export const Select = <T,>({
  label,

  trigger,
  selected,

  onSelect,
  options,
  renderOption,
}: SelectProps<T>): ReactNode => {
  return (
    <Dropdown<T> label={label} selected={selected} onSelect={onSelect}>
      <Dropdown.Trigger as={trigger} />
      <Dropdown.Menu>
        {options.map(option => (
          <Dropdown.Item<T> key={String(option)} value={option}>
            {renderOption(option)}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
