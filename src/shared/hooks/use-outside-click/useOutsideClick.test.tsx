import { fireEvent } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOutsideClick } from './useOutsideClick'

describe('useOutsideClick', () => {
  it('요소 외부를 클릭했을 때 콜백이 호출되어야 한다', () => {
    const callback = vi.fn()

    // div 엘리먼트를 생성하고 document에 추가
    const div = document.createElement('div')
    document.body.appendChild(div)

    const { unmount } = renderHook(() => useOutsideClick({ current: div }, callback))

    // div 바깥을 클릭
    fireEvent.mouseDown(document.body)

    expect(callback).toHaveBeenCalledTimes(1)

    // 테스트 끝나면 정리
    unmount()
    document.body.removeChild(div)
  })

  it('요소 내부를 클릭했을 때 콜백이 호출되지 않아야 한다', () => {
    const callback = vi.fn()

    const div = document.createElement('div')
    document.body.appendChild(div)

    const { unmount } = renderHook(() => useOutsideClick({ current: div }, callback))

    // div 내부를 클릭
    fireEvent.mouseDown(div)

    expect(callback).not.toHaveBeenCalled()

    unmount()
    document.body.removeChild(div)
  })
})
