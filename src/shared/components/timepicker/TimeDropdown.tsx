'use client'

import { useRef, useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { theme } from '@shared/styles/emotion/theme'

export interface TimeDropdownProps {
  value: string
  isOpen: boolean
  onConfirm: (newValue: string) => void
  onOpenChange: (isOpen: boolean) => void
  onCancel?: () => void
}

export default function TimeDropdown({ value, isOpen, onConfirm, onCancel, onOpenChange }: TimeDropdownProps) {
  const [initH, initM] = value.split(':').map(s => parseInt(s, 10))
  const [hour, setHour] = useState(isNaN(initH) ? 0 : initH)
  const [minute, setMinute] = useState(isNaN(initM) ? 0 : initM)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // 외부 클릭 감지 핸들러
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      // 드롭다운이 열려있을 때만 처리
      if (!wrapperRef.current || !dropdownRef.current) return
      const isClickInWrapper = wrapperRef.current.contains(event.target as Node)
      const isClickInDropdown = dropdownRef.current.contains(event.target as Node)

      // 클릭이 wrapper의 트리거 버튼에서 발생했는지 확인
      const triggerElement = wrapperRef.current.querySelector('button')
      const isClickOnTrigger = triggerElement && triggerElement.contains(event.target as Node)

      // 외부 클릭인 경우에만 닫기
      if (!isClickInWrapper || (isClickInWrapper && !isClickInDropdown && !isClickOnTrigger)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      //이벤트리스너 제거
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger
        onClick={() => {
          onOpenChange(!isOpen)
        }}
      >
        {String(hour).padStart(2, '0')} : {String(minute).padStart(2, '0')}
      </Trigger>
      <Dropdown isOpen={isOpen} ref={dropdownRef} onClick={e => e.stopPropagation()}>
        <Columns>
          <Column>
            {Array.from({ length: 24 }, (_, i) => i).map(h => (
              <Option key={h} selected={h === hour} onClick={() => setHour(h)}>
                {String(h).padStart(2, '0')}
              </Option>
            ))}
          </Column>
          <Column style={{ marginLeft: '2px' }}>
            {Array.from({ length: 60 }, (_, i) => i).map(m => (
              <Option key={m} selected={m === minute} onClick={() => setMinute(m)}>
                {String(m).padStart(2, '0')}
              </Option>
            ))}
          </Column>
        </Columns>
        <ActionWrapper>
          <ActButton onClick={handleClose}>Cancel</ActButton>
          <ActButton primary onClick={handleConfirm}>
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
`

const Dropdown = styled.div<{ isOpen: boolean }>`
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

  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};

  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    visibility 0s linear ${({ isOpen }) => (isOpen ? '0s' : '0.2s')};
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
  padding: 5px 21px;
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
