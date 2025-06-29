import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useCountUp } from './use-count-up'

describe('hooks/use-count-up', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16))
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should start from 0 and count up to the end number', () => {
    const { result } = renderHook(() => useCountUp(100, 1000))

    expect(result.current).toBe(0)

    act(() => {
      // 전체 애니메이션을 simulate
      vi.advanceTimersByTime(500)
    })

    // 절반 진행되었으므로 100 기준으로 0~100 사이 중간값이어야 함
    const midValue = result.current
    expect(midValue).toBeGreaterThan(0)
    expect(midValue).toBeLessThan(100)

    act(() => {
      vi.advanceTimersByTime(600) // 총 1100ms -> 종료 시점 넘김
    })

    expect(result.current).toBe(100)
  })

  it('cleanup animation frame on unmount', () => {
    const cancelSpy = vi.spyOn(global, 'cancelAnimationFrame')

    const { unmount } = renderHook(() => useCountUp(100, 1000))

    unmount()

    expect(cancelSpy).toHaveBeenCalled()
  })

  it('should not run if endNumber is null or undefined', () => {
    const { result } = renderHook(() => useCountUp(undefined as unknown as number))
    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current).toBe(0)
  })
})
