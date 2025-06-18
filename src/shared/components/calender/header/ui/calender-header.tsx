'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import styled from '@emotion/styled'

import { LucideIcon } from '@shared/components/lucide-icon'
import { theme } from '@shared/styles/theme'

interface CalendarHeaderProps {
  currentMonth: Date
  onPrev: () => void
  onNext: () => void
}

export const CalendarHeader = ({ currentMonth, onPrev, onNext }: CalendarHeaderProps) => (
  <Header>
    <ArrowButton onClick={onPrev}>
      <LucideIcon name='ChevronLeft' size={16} />
    </ArrowButton>
    <CurrentMonth>{format(currentMonth, 'yyyy년 M월', { locale: ko })}</CurrentMonth>
    <ArrowButton onClick={onNext}>
      <LucideIcon name='ChevronRight' size={16} />
    </ArrowButton>
  </Header>
)

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`

const CurrentMonth = styled.h3`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
`
