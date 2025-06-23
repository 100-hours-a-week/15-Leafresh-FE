import { fireEvent } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKeyClose } from './useKeyClose'

describe('useKeyClose', () => {
  it('기본 키 (Escape) 입력 시 콜백이 실행되어야 한다', () => {
    const callback = vi.fn()

    const div = document.createElement('div')
    document.body.appendChild(div)

    const { unmount } = renderHook(() => useKeyClose('Escape', { current: div }, callback))

    fireEvent.keyDown(div, { key: 'Escape' })

    expect(callback).toHaveBeenCalledTimes(1)

    unmount()
    document.body.removeChild(div)
  })

  it('다른 키를 눌렀을 때 콜백이 실행되지 않아야 한다', () => {
    const callback = vi.fn()

    const div = document.createElement('div')
    document.body.appendChild(div)

    const { unmount } = renderHook(() => useKeyClose('Escape', { current: div }, callback))

    fireEvent.keyDown(div, { key: 'Enter' })

    expect(callback).not.toHaveBeenCalled()

    unmount()
    document.body.removeChild(div)
  })

  it('지정한 키 (Enter) 입력 시 콜백이 실행되어야 한다', () => {
    const callback = vi.fn()

    const div = document.createElement('div')
    document.body.appendChild(div)

    const { unmount } = renderHook(() => useKeyClose('Enter', { current: div }, callback))

    fireEvent.keyDown(div, { key: 'Enter' })

    expect(callback).toHaveBeenCalledTimes(1)

    unmount()
    document.body.removeChild(div)
  })
})
