'use client'

import styled from '@emotion/styled'

import { LucideIcon } from '@/shared/components'

export interface BackButtonProps {
  onClick?: () => void
  className?: string
}

export const BackButton = ({ onClick, className }: BackButtonProps) => {
  const handleClick = () => {
    onClick?.()
    if (typeof window !== 'undefined') {
      // 클라이언트에서만 뒤로가기 수행
      window.history.back()
    }
  }

  return (
    <Button aria-label='back' onClick={handleClick} className={className}>
      <LucideIcon name='MoveLeft' size={29} color='lfBlack' />
    </Button>
  )
}

// ===== Styled =====
const Button = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
`
