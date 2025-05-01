import { describe, expect, it } from 'vitest'

import { act, renderHook } from '@testing-library/react'

import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('초기 상태를 false로 설정', () => {
    const { result } = renderHook(() => useToggle())
    const { value } = result.current

    expect(value).toBe(false)
  })

  it('초기 상태를 true로 설정', () => {
    const { result } = renderHook(() => useToggle(true))
    const { value } = result.current

    expect(value).toBe(true)
  })

  it('toggle() 호출 시 상태 반전', () => {
    const { result } = renderHook(() => useToggle(false))
    const { toggle } = result.current

    act(() => {
      toggle()
    })

    const { value: valueAfterToggle } = result.current
    expect(valueAfterToggle).toBe(true)

    act(() => {
      toggle()
    })

    const { value: valueAfterSecondToggle } = result.current
    expect(valueAfterSecondToggle).toBe(false)
  })

  it('setValue(true)로 상태를 true로 설정', () => {
    const { result } = renderHook(() => useToggle(false))
    const { setValue } = result.current

    act(() => {
      setValue(true)
    })

    const { value } = result.current
    expect(value).toBe(true)
  })

  it('setValue(false)로 상태를 false로 설정', () => {
    const { result } = renderHook(() => useToggle(true))
    const { setValue } = result.current

    act(() => {
      setValue(false)
    })

    const { value } = result.current
    expect(value).toBe(false)
  })

  it('여러번 상태 변경 후 원하는 토글로 변경', () => {
    const { result } = renderHook(() => useToggle(true))
    const { setValue } = result.current

    act(() => {
      setValue(false)
      setValue(true)
      setValue(false)
    })

    const { value } = result.current
    expect(value).toBe(false)
  })
})
