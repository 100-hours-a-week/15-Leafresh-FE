'use client'

import { useRouter } from 'next/navigation'

import { LucideIcon } from '@/shared/components'

import * as S from './styles'

export interface BackButtonProps {
  clickHandler?: () => void
  className?: string
}

export const BackButton = ({ clickHandler, className }: BackButtonProps) => {
  const router = useRouter()

  const handleClick = () => {
    clickHandler?.()
    if (typeof window !== 'undefined') {
      router.back()
    }
  }

  return (
    <S.Button aria-label='back' onClick={handleClick} className={className}>
      <LucideIcon name='MoveLeft' size={29} color='lfBlack' />
    </S.Button>
  )
}
