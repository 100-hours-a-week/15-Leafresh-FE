'use client'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'

import { useToastStore } from '@shared/context/toast/ToastStore'
import { ToastType } from '@shared/context/toast/type'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import * as S from './styles'

export const Toast = () => {
  const { isOpen, type, description, close: closeToast } = useToastStore()

  useEffect(() => {
    if (!isOpen || !description) return
    const timer = setTimeout(() => {
      closeToast()
    }, 2000)
    return () => clearTimeout(timer)
  }, [isOpen, description, closeToast])

  const iconName = type === ToastType.Success ? 'CheckCheck' : 'CircleAlert'
  const color = type === ToastType.Success ? 'lfBlue' : 'lfRed'

  return (
    <AnimatePresence>
      {isOpen && description && (
        <S.MotionContainer
          key='toast'
          toastType={type}
          initial={{ opacity: 0, x: '-50%', y: 50 }}
          animate={{ opacity: 1, x: '-50%', y: 0 }}
          exit={{ opacity: 0, x: '-50%', y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <S.Wrapper>
            <LucideIcon name={iconName} size={20} color={color} />
          </S.Wrapper>
          <S.Message>{description}</S.Message>
          <S.CloseIcon onClick={closeToast}>
            <LucideIcon name='X' size={16} color='lfBlack' />
          </S.CloseIcon>
        </S.MotionContainer>
      )}
    </AnimatePresence>
  )
}
