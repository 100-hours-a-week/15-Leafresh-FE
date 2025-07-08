import { motion } from 'motion/react'

import styled from '@emotion/styled'

import { ToastType } from '@/shared/context'

export const MotionContainer = styled(motion.div)<{ toastType: ToastType }>`
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

  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  color: ${({ toastType, theme }) =>
    toastType === ToastType.Success ? theme.colors.lfBlack.base : theme.colors.lfRed.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

export const Wrapper = styled.div`
  display: flex;
  align-self: center;
`

export const Message = styled.span`
  flex: 1;
  text-align: center;
  white-space: pre-line;
  line-height: 1.3;
`

export const CloseIcon = styled.div`
  position: absolute;
  right: 7px;
  top: 4px;
  cursor: pointer;
`
