'use client'
import { useToggle } from '@shared/hooks/useToggle/useToggle'
import { theme } from '@shared/styles/theme'

import TimeDropdown from './TimeDropdown'

import styled from '@emotion/styled'

export interface TimePickerProps {
  label?: string
  startValue: string
  endValue: string
  onChangeStart: (v: string) => void //기본 시작시간 값
  onChangeEnd: (v: string) => void //기본 종료시간 값
  className?: string
  labelClassName?: string
}

const TimePicker = ({ label, startValue, endValue, onChangeStart, onChangeEnd, className }: TimePickerProps) => {
  const { value: startOpen, toggle: toggleStart, setValue: setStartOpen } = useToggle(false)
  const { value: endOpen, toggle: toggleEnd, setValue: setEndOpen } = useToggle(false)

  return (
    <Wrapper className={className}>
      {label && <Title>{label}</Title>}
      <RangeWrapper isOpen={startOpen || endOpen}>
        <Panel
          onClick={() => {
            setStartOpen(true)
            setEndOpen(false)
          }}
        >
          <PanelLabel>시작시간</PanelLabel>
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
        </Panel>
        <Divider />
        <Panel
          onClick={() => {
            setStartOpen(false)
            setEndOpen(true)
          }}
        >
          <PanelLabel>종료시간</PanelLabel>
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
        </Panel>
      </RangeWrapper>
    </Wrapper>
  )
}
export default TimePicker

/* ===== 스타일 ===== */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Title = styled.h2`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: 12px;
  color: ${theme.colors.lfBlack.base};
`
const RangeWrapper = styled.div<{ isOpen: boolean }>`
  position: relative;
  display: flex;
  background: #fafafa;
  border-radius: ${theme.radius.xs};
  width: 100%;
  height: 72px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${theme.colors.lfBlack.base};

    transform-origin: center;
    transform: scaleX(${props => (props.isOpen ? 1 : 0)});
    transition: transform 0.2s ease;
  }
`
const Panel = styled.div`
  flex: 1;
  padding: 12px 16px;
  cursor: pointer;
`
const PanelLabel = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
  margin-bottom: 15px;
`
const Divider = styled.div`
  width: 0.1px;
  margin: 5px 0;
  background: #d3d3d3;
`
