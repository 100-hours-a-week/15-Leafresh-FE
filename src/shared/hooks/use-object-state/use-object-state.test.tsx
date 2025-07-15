import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useObjectState } from './use-object-state'

type TestObject = {
  id: number
  name: string
  age: number
}

const ERROR_TEXTS = {
  NON_NULL: 'useObjectState: initialState must be a non-null object',
}

describe('useObjectState', () => {
  it('객체가 아닌 초기값을 주면 에러가 발생', () => {
    expect(() => {
      // @ts-expect-error: 고의로 타입 무시
      renderHook(() => useObjectState(123))
    }).toThrowError(ERROR_TEXTS.NON_NULL)
  })

  it('null 초기값을 주면 에러가 발생', () => {
    expect(() => {
      // @ts-expect-error: 고의로 타입 무시
      renderHook(() => useObjectState(null))
    }).toThrowError(ERROR_TEXTS.NON_NULL)
  })

  it('배열 초기값을 주면 에러가 발생', () => {
    expect(() => {
      renderHook(() => useObjectState([]))
    }).toThrowError(ERROR_TEXTS.NON_NULL)
  })

  const initialState: TestObject = {
    id: 1,
    name: '사랑',
    age: 20,
  }

  it('초기 상태를 정확히 반환', () => {
    const { result } = renderHook(() => useObjectState<TestObject>(initialState))
    const { state } = result.current

    expect(state).toEqual(initialState)
  })

  it('updateState를 사용해 일부 필드 수정 여부', () => {
    const { result } = renderHook(() => useObjectState<TestObject>(initialState))
    const { updateState } = result.current

    act(() => {
      updateState({ name: '사랑둥이' })
    })

    const { state } = result.current
    expect(state).toEqual({
      id: 1,
      name: '사랑둥이',
      age: 20,
    })
  })

  it('setState를 사용하여 전체 객체 교체', () => {
    const { result } = renderHook(() => useObjectState<TestObject>(initialState))
    const { setState } = result.current

    const newState: TestObject = {
      id: 2,
      name: '새로운 사랑',
      age: 25,
    }

    act(() => {
      setState(newState)
    })

    const { state } = result.current
    expect(state).toEqual(newState)
  })

  it('resetState를 사용하여 초기 상태로 복구', () => {
    const { result } = renderHook(() => useObjectState<TestObject>(initialState))
    const { setState, resetState } = result.current

    const firstModifiedState: TestObject = {
      id: 99,
      name: '변경된 사랑',
      age: 99,
    }

    const secondModifiedState: TestObject = {
      id: 98,
      name: '변경된 사랑',
      age: 98,
    }

    // 상태 변경
    act(() => {
      setState(firstModifiedState)
    })
    // 상태 변경
    act(() => {
      setState(secondModifiedState)
    })

    // 상태 리셋
    act(() => {
      resetState()
    })

    const { state } = result.current
    expect(state).toEqual(initialState)
  })
})
