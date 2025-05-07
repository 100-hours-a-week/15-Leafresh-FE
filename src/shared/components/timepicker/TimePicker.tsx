'use client'

import { useCallback } from 'react'
import styled from '@emotion/styled'
import { theme } from '@shared/styles/emotion/theme'

import TimeDropdown from './TimeDropdown'
import { useToggle } from '@shared/hooks/useToggle/useToggle'

export interface TimePickerProps {
  label?: string
  startValue: string
  endValue: string
  onChangeStart: (v: string) => void
  onChangeEnd: (v: string) => void
}

const TimePicker = ({
  label,
  startValue,
  endValue,
  onChangeStart,
  onChangeEnd,
}: TimePickerProps) => {

  const {
    value: startOpen,
    toggle: toggleStart,
    setValue: setStartOpen,
  } = useToggle(false)

  const {
    value: endOpen,
    toggle: toggleEnd,
    setValue: setEndOpen,
  } = useToggle(false)

  const handleStartOpen = useCallback((open: boolean) => {
    setStartOpen(open)
    if (open) setEndOpen(false)
  }, [setStartOpen, setEndOpen])

  const handleEndOpen = useCallback((open: boolean) => {
    setEndOpen(open)
    if (open) setStartOpen(false)
  }, [setEndOpen, setStartOpen])

  return (
    <Wrapper>
      {label && <Title>{label}</Title>}
      <RangeWrapper open={startOpen || endOpen}>
        <Panel>
          <PanelLabel>시작시간</PanelLabel>
          <TimeDropdown
            value={startValue}
            open={startOpen}
            onConfirm={onChangeStart}
            onCancel={() => setStartOpen(false)}
            onOpenChange={handleStartOpen}
          />
        </Panel>
        <Divider />
        <Panel>
          <PanelLabel>종료시간</PanelLabel>
          <TimeDropdown
            value={endValue}
            open={endOpen}
            onConfirm={onChangeEnd}
            onCancel={() => setEndOpen(false)}
            onOpenChange={handleEndOpen}
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
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semiBold};
  margin-bottom: 12px;
  color: ${theme.colors.lfBlack.base};
`
const RangeWrapper = styled.div<{open: boolean}>`
  position: relative;
  display: flex;
  background: #fafafa;
  border-radius: ${theme.radius.xs};
  width: 321px;
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
    transform: scaleX(${props => (props.open ? 1 : 0)});
    transition: transform 0.2s ease;
  }
`
const Panel = styled.div`
  flex: 1;
  padding: 12px 16px;
`
const PanelLabel = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
  margin-bottom: 4px;
`
const Divider = styled.div`
  width: 0.1px;
  margin: 5px 0;
  background: #d3d3d3;
`
