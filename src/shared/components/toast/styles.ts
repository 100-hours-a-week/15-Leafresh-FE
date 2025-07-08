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

  min-width: ${({ toastType }) => (toastType === 'Success' ? '209px' : '256px')};
  height: 60px;
  width: 250px;
  padding: 0px 20px;

  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  color: ${({ toastType, theme }) => (toastType === 'Success' ? theme.colors.lfBlack.base : theme.colors.lfRed.base)};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

export const Wrapper = styled.div<{ $toastCount: number; $isPaused: boolean }>`
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

export const ToastItem = styled(motion.div)<{ $isPaused: boolean }>`
  width: 100%;
  height: 60px;
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;

  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  transition: all 0.2s ease;

  ${({ $isPaused }) =>
    $isPaused &&
    `
    width: 100%; /* hover 시 width 풀려도 ok */
    max-width: 300px;
  `}
`
