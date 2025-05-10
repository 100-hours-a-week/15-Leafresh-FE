import styled from '@emotion/styled'

import LucideIcon from '@shared/lib/ui/LucideIcon'

export interface BackButtonProps {
  onClick?: () => void
}

const BackButton = ({ onClick }: BackButtonProps) => {

  const handleClick = () => {
    onClick?.()
    if (typeof window !== 'undefined') {
      // 클라이언트에서만 뒤로가기 수행
      window.history.back()
    }
  }

  return (
    <Button aria-label="back" onClick={handleClick}>
      <LucideIcon name="MoveLeft" size={29} color="lfBlack" />
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