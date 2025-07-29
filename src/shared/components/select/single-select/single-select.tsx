import { ReactElement, ReactNode } from 'react'

import { Dropdown } from '@/shared/components'

/**
 * T: 선택지의 타입
 * 외부에서 주입해야 하는 값으로 구성됨
 */
interface SelectProps<T> {
  trigger: ReactElement // 트리거 요소 (고정)
  onSelect: (value: T) => void

  options: T[]
  renderOption: (option: T) => ReactNode // T: object인 경우 대비
  getOptionKey: (option: T) => string | number
}

export const SingleSelect = <T,>({
  trigger,

  onSelect,
  options,
  renderOption,
  getOptionKey,
}: SelectProps<T>): ReactNode => {
  return (
    <Dropdown<T> onSelect={onSelect}>
      <Dropdown.Trigger as={trigger} />
      <Dropdown.Menu>
        {options.map(option => (
          <Dropdown.Item<T> key={getOptionKey(option)} value={option}>
            {renderOption(option)}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
