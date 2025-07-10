import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnmount } from './use-unmount'

describe('useUnmount', () => {
  it('컴포넌트 언마운트 시 콜백이 호출되어야 한다', () => {
    const callback = vi.fn()

    const { unmount } = renderHook(() => useUnmount(callback))

    // 컴포넌트를 언마운트 시키기
    unmount()

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
