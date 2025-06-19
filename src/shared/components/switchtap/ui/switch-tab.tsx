'use client'

import styled from '@emotion/styled'

import { theme } from '@shared/config/style/theme'

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
  return (
    <Container role='tablist' tabsCount={tabs.length} currentIndex={currentIndex} className={className}>
      {tabs.map((label, i) => (
        <TabButton
          key={`${label}-${i}`}
          role='tab'
          aria-selected={i === currentIndex}
          tabIndex={i === currentIndex ? 0 : -1}
          isActive={i === currentIndex}
          onClick={() => onChange(i)}
        >
          {label}
        </TabButton>
      ))}
    </Container>
  )
}

// ===== Styles =====
const Container = styled.div<{ tabsCount: number; currentIndex: number }>`
  display: inline-flex;
  width: 100%;
  height: 47px;
  border: 1px solid #ccc;
  border-radius: 24px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(${({ currentIndex }) => currentIndex} * 100% / ${({ tabsCount }) => tabsCount});
    width: calc(100% / ${({ tabsCount }) => tabsCount});
    height: 4px;
    background: ${theme.colors.lfGreenMain.base};
    transition: left 0.2s ease;
  }
`

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  background: ${({ isActive }) => (isActive ? theme.colors.lfGreenMain.base : theme.colors.lfWhite.base)};
  color: ${({ isActive }) => (isActive ? theme.colors.lfWhite.base : theme.colors.lfBlack.base)};
  border: none;
  cursor: pointer;
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semiBold};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${theme.colors.lfGreenMain.hover};
  }
  &:focus {
    outline: 2px solid ${theme.colors.lfGreenMain.base};
    outline-offset: 2px;
  }
`
