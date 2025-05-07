'use client'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { theme } from '@shared/styles/emotion/theme'

import { useOutsideClick } from '@shared/hooks/useOutsideClick/useOutsideClick'

export interface TimeDropdownProps {
  value: string
  open: boolean
  onConfirm: (newValue: string) => void
  onOpenChange: (open: boolean) => void
  onCancel?: () => void
}

export default function TimeDropdown({ value, open, onConfirm, onCancel, onOpenChange }: TimeDropdownProps) {
  const [initH, initM] = value.split(':').map(s => parseInt(s, 10))
  const [hour, setHour] = useState(isNaN(initH) ? 0 : initH)
  const [minute, setMinute] = useState(isNaN(initM) ? 0 : initM)

  const handleConfirm = () => {
    const hh = String(hour).padStart(2, '0')
    const mm = String(minute).padStart(2, '0')
    onConfirm(`${hh}:${mm}`)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    onCancel?.()

    //취소했을 때 반영되지 않게끔 변경
    const [resetH, resetM] = value.split(':').map(s => parseInt(s, 10))
    setHour(!isNaN(resetH) ? resetH : 0)
    setMinute(!isNaN(resetM) ? resetM : 0)
  }

  const timeRef = useRef<HTMLDivElement>(null)

  useOutsideClick(timeRef as React.RefObject<HTMLElement>, handleClose)

  return (
    <Wrapper ref={timeRef}>
      <Trigger
        onClick={() => {
          onOpenChange(!open)
        }}
      >
        {String(hour).padStart(2, '0')} : {String(minute).padStart(2, '0')}
      </Trigger>
      <Dropdown open={open}>
        <Columns>
          <Column>
            {Array.from({ length: 24 }, (_, i) => i).map(h => (
              <Option key={h} selected={h === hour} onClick={() => setHour(h)}>
                {String(h).padStart(2, '0')}
              </Option>
            ))}
          </Column>
          <Column>
            {Array.from({ length: 60 }, (_, i) => i).map(m => (
              <Option key={m} selected={m === minute} onClick={() => setMinute(m)}>
                {String(m).padStart(2, '0')}
              </Option>
            ))}
          </Column>
        </Columns>
        <ActionWrapper>
          <ActButton
            onClick={() => {
              handleClose()
            }}
          >
            Cancel
          </ActButton>
          <ActButton
            primary
            onClick={() => {
              handleConfirm()
            }}
          >
            OK
          </ActButton>
        </ActionWrapper>
      </Dropdown>
    </Wrapper>
  )
}

/* ===== 스타일 ===== */
const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

const Trigger = styled.button`
  width: 100%;
  appearance: none;
  background: transparent;
  border: none;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.lfBlack.base};
  text-align: start;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  &:active {
    background: rgba(0, 0, 0, 0.1);
  }
`

const Dropdown = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + 15px);
  width: 100%;
  background: ${theme.colors.lfBackdrop};
  color: ${theme.colors.lfDarkGray};
  border-radius: ${theme.radius.sm};
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;

  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-10px)')};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};

  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    visibility 0s linear ${({ open }) => (open ? '0s' : '0.2s')};
`

const Columns = styled.div`
  display: flex;
`
const Column = styled.ul`
  max-height: 200px;
  overflow-y: auto;
  border-right: 1px solid ${theme.colors.lfBlue};

  &::-webkit-scrollbar {
    width: 3px;
  }
`
const Option = styled.li<{ selected: boolean }>`
  padding: 5px 22px;
  cursor: pointer;
  background: ${({ selected }) => (selected ? `${theme.colors.lfGreenMain.hover}` : `${theme.colors.lfWhite.base}`)};
  color: ${({ selected }) => (selected ? `${theme.colors.lfWhite.base}` : `${theme.colors.lfGray.base}`)};
  &:hover {
    background: ${theme.colors.lfGreenInactive.base};
    color: ${theme.colors.lfDarkGray.base};
  }
`
const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid ${theme.colors.lfGreenBorder.base};
`
const ActButton = styled.button<{ primary?: boolean }>`
  flex: 1;
  padding: 8px 0;
  background: ${({ primary }) => (primary ? `${theme.colors.lfGreenMain.base}` : 'transparent')};
  color: ${({ primary }) => (primary ? `${theme.colors.lfWhite.base}` : `${theme.colors.lfBlack.base}`)};
  border: none;

  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.bold};

  cursor: pointer;
  &:hover {
    background: ${({ primary }) =>
      primary ? `${theme.colors.lfGreenMain.hover}` : `${theme.colors.lfLightGray.base}`};
  }
`
