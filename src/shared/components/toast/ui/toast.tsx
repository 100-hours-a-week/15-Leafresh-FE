'use client'
import { AnimatePresence, motion } from 'motion/react'

import { useEffect } from 'react'
import styled from '@emotion/styled'

import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import { useToastStore } from '@shared/context/toast/ToastStore'
import { ToastType } from '@shared/context/toast/type'
import { theme } from '@shared/styles/theme'

const Toast = () => {
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
        <MotionContainer
          key='toast'
          toastType={type}
          initial={{ opacity: 0, x: '-50%', y: 50 }}
          animate={{ opacity: 1, x: '-50%', y: 0 }}
          exit={{ opacity: 0, x: '-50%', y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Wrapper>
            <LucideIcon name={iconName} size={20} color={color} />
          </Wrapper>
          <Message>{description}</Message>
          <CloseIcon onClick={closeToast}>
            <LucideIcon name='X' size={16} color='lfBlack' />
          </CloseIcon>
        </MotionContainer>
      )}
    </AnimatePresence>
  )
}

export default Toast

const MotionContainer = styled(motion.div)<{ toastType: ToastType }>`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;

  display: flex;
  align-items: center;
  gap: 4px;

  min-width: ${({ toastType }) => (toastType === ToastType.Success ? '209px' : '256px')};
  height: 60px;
  width: 250px;
  padding: 0px 20px;

  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
  color: ${({ toastType }) => (toastType === ToastType.Success ? theme.colors.lfBlack.base : theme.colors.lfRed.base)};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
`

const Wrapper = styled.div`
  display: flex;
  align-self: center;
`

const Message = styled.span`
  flex: 1;
  text-align: center;
  white-space: pre-line;
  line-height: 1.3;
`

const CloseIcon = styled.div`
  position: absolute;
  right: 7px;
  top: 4px;
  cursor: pointer;
`
