import { motion } from 'motion/react'

import { ChallengeVerifyExamples } from '@features/challenge/components'

import styled from '@emotion/styled'

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px);
  z-index: 999;
`

export const MotionWrapper = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80%;

  display: flex;
  flex-direction: column;
  border-top-left-radius: ${({ theme }) => theme.radius.xl};
  border-top-right-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.lfWhite.base};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
  z-index: 300;
`
export const DragBar = styled.div<{ isHover: boolean }>`
  width: 60px;
  height: 6px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.lfGray.base};
  margin: 8px auto 12px;

  background: ${({ isHover, theme }) => (isHover ? theme.colors.lfDarkGray.base : theme.colors.lfGray.base)};
  transition: background-color 0.2s ease;
`

export const GuideHeader = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

export const GuideContent = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
`

export const StyledChallengeVerifyExamples = styled(ChallengeVerifyExamples)`
  padding: 20px 30px 0px 30px;
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.xl};
  .verify-input {
    width: 40%;
  }
`

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
`

export const InfoSection = styled.div`
  width: 100%;
  border-top: 4px solid ${({ theme }) => theme.colors.lfLightGray.base};
  margin-top: 24px;
  padding: 45px 30px 0 30px;
`

export const InfoTitle = styled.h4`
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.md};
  margin-bottom: 16px;
`

export const InfoItem = styled.div`
  padding-left: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: 12px;
  .left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  strong {
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }
`
