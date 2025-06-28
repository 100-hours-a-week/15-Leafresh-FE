import { motion } from 'motion/react'

import styled from '@emotion/styled'

export const MotionWindow = styled(motion.div)`
  position: absolute;
  max-width: 385px;
  width: 90%;
  height: 95%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  z-index: 100000;

  display: flex;
  flex-direction: column;
`

// 채팅 본문 영역
export const Body = styled.div`
  flex: 1;
  background: #f5fff2;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`
