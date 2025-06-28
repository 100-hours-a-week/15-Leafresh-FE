'use client'

import { LucideIcon } from '@/shared/components'

import * as S from './styles'

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
    <S.Button aria-label='back' onClick={handleClick} className={className}>
      <LucideIcon name='MoveLeft' size={29} color='lfBlack' />
    </S.Button>
  )
}
