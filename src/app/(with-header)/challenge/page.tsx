'use client'
import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'

import Dropdown from '@shared/components/dropdown/Dropdown'

interface ChallengePageProps {
  className?: string
}

const ChallengePage = ({ className }: ChallengePageProps): ReactNode => {
  const [selected, setSelected] = useState<string>('')

  const handleChange = (value: string) => {
    setSelected(value)
  }

  return (
    <div className={className}>
      <Overlay>
        <StyledDropdown
          label='라벨'
          options={['선택지1', '선택지2', '선택지3', '선택지4', '선택지5', '선택지6']}
          selected={selected}
          onChange={handleChange}
          maxVisibleCount={4}
        />
      </Overlay>
    </div>
  )
}

export default ChallengePage

// === 스타일 ===
const Overlay = styled.div`
  height: 200px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledDropdown = styled(Dropdown)`
  width: 150px;
`
