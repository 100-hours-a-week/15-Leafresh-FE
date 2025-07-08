import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSessionStorage } from './use-session-storage'

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('존재하는 key를 읽으면 JSON 파싱된 값을 반환한다', () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1, name: '사랑' }))

    const { result } = renderHook(() => useSessionStorage('user'))

    expect(result.current).toEqual({ id: 1, name: '사랑' })
  })

  it('존재하는 key가 JSON 형식이 아니면 string 그대로 반환한다', () => {
    sessionStorage.setItem('rawText', '그냥문자열')

    const { result } = renderHook(() => useSessionStorage('rawText'))

    expect(result.current).toBe('그냥문자열')
  })

  it('존재하지 않는 key는 null을 반환한다', () => {
    const { result } = renderHook(() => useSessionStorage('not-exist'))

    expect(result.current).toBeNull()
  })

  it('key를 넘기지 않으면 sessionStorage 전체 데이터를 객체로 반환한다', () => {
    sessionStorage.setItem('token', JSON.stringify('abc123'))
    sessionStorage.setItem('user', JSON.stringify({ id: 2 }))
    sessionStorage.setItem('note', 'not-json')

    const { result } = renderHook(() => useSessionStorage())

    expect(result.current).toEqual({
      token: 'abc123',
      user: { id: 2 },
      note: 'not-json',
    })
  })
})
