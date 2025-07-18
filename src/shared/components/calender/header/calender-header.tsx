'use client'

import { ko } from 'date-fns/locale'

import { format } from 'date-fns'

import { LucideIcon } from '@/shared/components'

import * as S from './styles'
interface CalendarHeaderProps {
  currentMonth: Date
  onPrev: () => void
  onNext: () => void
}

export const CalendarHeader = ({ currentMonth, onPrev, onNext }: CalendarHeaderProps) => (
  <S.Header>
    <S.ArrowButton onClick={onPrev}>
      <LucideIcon name='ChevronLeft' size={16} />
    </S.ArrowButton>
    <S.CurrentMonth>{format(currentMonth, 'yyyy년 M월', { locale: ko })}</S.CurrentMonth>
    <S.ArrowButton onClick={onNext}>
      <LucideIcon name='ChevronRight' size={16} />
    </S.ArrowButton>
  </S.Header>
)
