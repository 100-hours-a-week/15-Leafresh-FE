'use client'

import * as S from './styles'

export interface SwitchTapProps {
  //탭의 수(제목들)
  tabs: string[]

  //현재 활성화된 탭 인덱스
  currentIndex: number

  //탭이 변경될 때 호출
  onChange: (newIndex: number) => void
  className?: string
}

export const SwitchTap = ({ tabs, currentIndex, onChange, className }: SwitchTapProps) => {
  if (tabs.length < 2) {
    return <></>
  }
  return (
    <S.Container role='tablist' tabsCount={tabs.length} currentIndex={currentIndex} className={className}>
      {tabs.map((label, i) => (
        <S.TabButton
          key={`${label}-${i}`}
          role='tab'
          aria-selected={i === currentIndex}
          tabIndex={i === currentIndex ? 0 : -1}
          isActive={i === currentIndex}
          onClick={() => onChange(i)}
        >
          {label}
        </S.TabButton>
      ))}
    </S.Container>
  )
}
