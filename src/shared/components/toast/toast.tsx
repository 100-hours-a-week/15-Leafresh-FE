'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence } from 'motion/react'

import { toastStore } from '@/shared/context'

import { LucideIcon } from '../lucide-icon'

import * as S from './styles'

export const Toast = () => {
  const toasts = toastStore(state => state.toasts)
  const remove = toastStore(state => state.remove)

  const [isPaused, setIsPaused] = useState<boolean>(false)

  // 각 Toast마다 타이머 개별 설정
  useEffect(() => {
    if (isPaused) return

    const timers = toasts.map(toast => {
      const timer = setTimeout(() => {
        remove(toast.id)
      }, 2000)
      return () => clearTimeout(timer)
    })
    return () => {
      timers.forEach(clear => clear())
    }
  }, [toasts, isPaused, remove])

  return (
    <S.Wrapper
      $toastCount={toasts.length}
      $isPaused={isPaused}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false}>
        {[...toasts].reverse().map((toast, index) => {
          const maxWidth = 250
          const shrinkPerStep = 10
          const width = isPaused ? maxWidth : maxWidth - index * shrinkPerStep
          const gap = isPaused ? 70 : 20
          const bottom = index * gap

          return (
            <S.ToastItem
              key={toast.id}
              style={{
                bottom: `${bottom}px`,
                width: `${width}px`,
                zIndex: 999 - index,
              }}
              $isPaused={isPaused}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.1,
              }}
            >
              <LucideIcon
                name={toast.type === 'Success' ? 'CheckCheck' : 'CircleAlert'}
                size={20}
                color={toast.type === 'Success' ? 'lfBlue' : 'lfRed'}
              />
              <S.Message>{toast.description}</S.Message>
              <S.CloseIcon onClick={() => remove(toast.id)}>
                <LucideIcon name='X' color='lfBlack' />
              </S.CloseIcon>
            </S.ToastItem>
          )
        })}
      </AnimatePresence>
    </S.Wrapper>
  )
}
