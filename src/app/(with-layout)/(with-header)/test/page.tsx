'use client'
import { ReactNode } from 'react'

import { SinglePrimitiveSelect } from '@/shared/components/select'

interface TestPageProps {
  className?: string
}

const TestPage = ({ className }: TestPageProps): ReactNode => {
  return (
    <div className={className}>
      <SinglePrimitiveSelect
        label='과일 선택'
        options={[
          '사과',
          '바나나',
          '포도',
          '사과1',
          '바나나1',
          '포도1',
          '사과2',
          '바나나2',
          '포도2',
          '사과3',
          '바나나3',
          '포도3',
        ]}
      />
    </div>
  )
}

export default TestPage
