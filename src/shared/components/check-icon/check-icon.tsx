import { motion } from 'motion/react'

import { theme } from '@/shared/config'
import styled from '@emotion/styled'

export const CheckIcon = () => {
  return (
    <CheckSvg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <motion.path
        d='M5 13l4 4L19 7'
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </CheckSvg>
  )
}

const CheckSvg = styled.svg`
  width: 50px;
  height: 50px;

  color: ${theme.colors.lfBlack.base};
`
