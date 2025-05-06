'use client'
import styled from '@emotion/styled'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/emotion/theme'

export interface BackButtonProps {
  onClick?: () => void
}

const BackButton = ({ onClick }: BackButtonProps) => {
  const handleClick = () => {
    onClick?.()
    window.history.back()
  }

  return (
    <Button aria-label="back" onClick={handleClick}>
      <LucideIcon name="CircleChevronLeft" size={29} color="lfBlack" />
    </Button>
  )
}

export default BackButton

// ===== Styled =====
const Button = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: ${theme.radius.full};

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
`