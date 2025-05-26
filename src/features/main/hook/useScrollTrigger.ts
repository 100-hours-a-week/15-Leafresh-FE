// src/shared/hooks/useScrollTrigger.ts
import { useEffect } from 'react'

export function useScrollTrigger(selector: string, options?: IntersectionObserverInit) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!els.length) return

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('visible', entry.isIntersecting)
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -20% 0px', // 아래에서 20% 남기고 트리거
        threshold: 0.1,
        ...options,
      },
    )

    els.forEach(el => obs.observe(el))
    return () => {
      obs.disconnect()
    }
  }, [selector, options])
}
