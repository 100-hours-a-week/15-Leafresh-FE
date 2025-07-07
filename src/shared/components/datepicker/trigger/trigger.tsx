import { ReactNode } from 'react'

import { format } from 'date-fns'

import { dayToString } from '@/shared/lib'

import { InjectedTriggerProps } from '../../dropdown'

import * as S from './styles'

interface DatePickerTriggerProps extends InjectedTriggerProps {
  startDate?: Date
  endDate?: Date

  className?: string
}

export const DatePickerTrigger = ({ startDate, endDate, onClick, className }: DatePickerTriggerProps): ReactNode => {
  return (
    <S.DateWrapper className={className} onClick={onClick}>
      <S.DateText isValid={!!startDate}>
        {startDate ? `${format(startDate, 'MM.dd')} (${dayToString(startDate.getDay())})` : '시작날짜'}
      </S.DateText>
      <S.Tilde>~</S.Tilde>
      <S.DateText isValid={!!endDate}>
        {endDate ? `${format(endDate, 'MM.dd')} (${dayToString(endDate.getDay())})` : '종료날짜'}
      </S.DateText>
    </S.DateWrapper>
  )
}
