import { ReactElement, ReactNode } from 'react'

import { Dropdown } from '../../dropdown'

/**
 * T: 선택지의 타입
 * 외부에서 주입해야 하는 값으로 구성됨
 */
interface SelectProps<F> {
  initialOpen?: boolean

  trigger: ReactElement // 트리거 요소 (고정)
  component: ReactElement // 띄울 요소
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ComponentSelect = <T, F extends (...args: any[]) => any>({
  initialOpen = false,
  trigger,
  component,

  className,
}: SelectProps<F>): ReactNode => {
  return (
    <Dropdown<T> initialOpen={initialOpen} className={className}>
      <Dropdown.Trigger as={trigger} />
      <Dropdown.Component as={component} />
    </Dropdown>
  )
}
