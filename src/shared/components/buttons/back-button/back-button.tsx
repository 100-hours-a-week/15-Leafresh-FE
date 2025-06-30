'use client'

import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import { LucideIcon } from '@/shared/components'

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
    <Button aria-label='back' onClick={handleClick} className={className}>
      <LucideIcon name='MoveLeft' size={29} color='lfBlack' />
    </Button>
  )
}

const Button = styled.button`
  padding: 4px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`
