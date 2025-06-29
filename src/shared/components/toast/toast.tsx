'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import styled from '@emotion/styled'

import { theme } from '@/shared/config'
import { toastStore, ToastType } from '@/shared/context'

import { LucideIcon } from '../lucide-icon'

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
      }, 3000000)
      return () => clearTimeout(timer)
    })
    return () => {
      timers.forEach(clear => clear())
    }
  }, [toasts, isPaused, remove])

  return (
    <Wrapper
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
            <ToastItem
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
                name={toast.type === ToastType.Success ? 'CheckCheck' : 'CircleAlert'}
                size={20}
                color={toast.type === ToastType.Success ? 'lfBlue' : 'lfRed'}
              />
              <Message>{toast.description}</Message>
              <CloseIcon onClick={() => remove(toast.id)}>
                <LucideIcon name='X' color='lfBlack' />
              </CloseIcon>
            </ToastItem>
          )
        })}
      </AnimatePresence>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $toastCount: number; $isPaused: boolean }>`
  width: 250px;
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ $toastCount, $isPaused }) =>
    $isPaused &&
    `
    pointer-events: auto;
    min-height: ${$toastCount * 85}px;
  `}
`

const ToastItem = styled(motion.div)<{ $isPaused: boolean }>`
  width: 100%;
  height: 60px;
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;

  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};

  transition: all 0.2s ease;

  ${({ $isPaused }) =>
    $isPaused &&
    `
    width: 100%; /* hover 시 width 풀려도 ok */
    max-width: 300px;
  `}
`

const Message = styled.span`
  text-align: center;
  flex: 1;
  white-space: pre-line;
  line-height: 1.4;
`

const CloseIcon = styled.div`
  position: absolute;
  right: 7px;
  top: 4px;
  cursor: pointer;
`
