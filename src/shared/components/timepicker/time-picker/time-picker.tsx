'use client'

import { useToggle } from '@/shared/hooks'

import { TimeDropdown } from '../dropdown'

import * as S from './styles'

export interface TimePickerProps {
  label?: string
  startValue: string
  endValue: string
  onChangeStart: (v: string) => void //기본 시작시간 값
  onChangeEnd: (v: string) => void //기본 종료시간 값
  className?: string
  labelClassName?: string
}

export const TimePicker = ({ label, startValue, endValue, onChangeStart, onChangeEnd, className }: TimePickerProps) => {
  const { value: startOpen, toggle: toggleStart, setValue: setStartOpen } = useToggle(false)
  const { value: endOpen, toggle: toggleEnd, setValue: setEndOpen } = useToggle(false)

  return (
    <S.Wrapper className={className}>
      {label && <S.Title>{label}</S.Title>}
      <S.RangeWrapper isOpen={startOpen || endOpen}>
        <S.Panel
          onClick={() => {
            setStartOpen(true)
            setEndOpen(false)
          }}
        >
          <S.PanelLabel>시작시간</S.PanelLabel>
          <TimeDropdown
            value={startValue}
            isOpen={startOpen}
            onConfirm={onChangeStart}
            onCancel={() => setStartOpen(false)}
            onOpenChange={() => {
              toggleStart()
              setEndOpen(false)
            }}
          />
        </S.Panel>
        <S.Divider />
        <S.Panel
          onClick={() => {
            setStartOpen(false)
            setEndOpen(true)
          }}
        >
          <S.PanelLabel>종료시간</S.PanelLabel>
          <TimeDropdown
            value={endValue}
            isOpen={endOpen}
            onConfirm={onChangeEnd}
            onCancel={() => setEndOpen(false)}
            onOpenChange={() => {
              toggleEnd()
              setStartOpen(false)
            }}
          />
        </S.Panel>
      </S.RangeWrapper>
    </S.Wrapper>
  )
}
