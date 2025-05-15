import styled from '@emotion/styled'

import LucideIcon from '@shared/lib/ui/LucideIcon'

export interface BackButtonProps {
  onClick?: () => void
  className?: string
}

const BackButton = ({ onClick, className }: BackButtonProps) => {
  const handleClick = () => {
    console.log('클릭시 이걸 실행하세요', onClick)

    if (onClick) {
      onClick()
    } else if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <Button aria-label='back' onClick={handleClick} className={className}>
      <LucideIcon name='ChevronLeft' size={29} color='lfBlack' />
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
`
