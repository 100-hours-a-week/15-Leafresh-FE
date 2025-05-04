'use client'
import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'

import Dropdown, { DropdownProps } from '@shared/components/dropdown/Dropdown'
import { StyledGeneric } from '@shared/styles/emotion/utils'

interface ChallengePageProps {
  className?: string
}

const ChallengePage = ({ className }: ChallengePageProps): ReactNode => {
  const [selected, setSelected] = useState<string>('')

  const options = ['선택지1', '선택지2', '선택지3', '선택지4', '선택지5', '선택지6']

  const handleChange = (value: string) => {
    setSelected(value)
  }

  return (
    <div className={className}>
      <Overlay>
        <StyledDropdown
          label='라벨'
          options={options}
          selected={selected}
          onChange={handleChange}
          getOptionLabel={option => option}
          getOptionKey={option => option}
          maxVisibleCount={4}
        />
      </Overlay>
    </div>
  )
}

export default ChallengePage

// === 스타일 ===
const Overlay = styled.div`
  height: 300px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledDropdown = StyledGeneric<DropdownProps<string>>(
  Dropdown,
  `
  width: 150px;
`,
)
