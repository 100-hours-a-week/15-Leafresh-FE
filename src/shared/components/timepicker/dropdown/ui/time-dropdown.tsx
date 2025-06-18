'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

export interface TimeDropdownProps {
  value: string
  isOpen: boolean
  onConfirm: (newValue: string) => void
  onOpenChange: (isOpen: boolean) => void
  onCancel?: () => void
}

export function TimeDropdown({ value, isOpen, onConfirm, onCancel, onOpenChange }: TimeDropdownProps) {
  const [initH, initM] = value.split(':').map(s => parseInt(s, 10))
  const [hour, setHour] = useState(isNaN(initH) ? 0 : initH)
  const [minute, setMinute] = useState(isNaN(initM) ? 0 : initM)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const hourColumnRef = useRef<HTMLUListElement>(null)
  const minuteColumnRef = useRef<HTMLUListElement>(null)

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

  //선택한 옵션 포커싱
  useEffect(() => {
    if (!isOpen) return

    //현재 문서(페이지)의 스크롤에 영향 주지 않게
    const scrollToCenter = (columnRef: React.RefObject<HTMLUListElement | null>) => {
      const container = columnRef.current
      if (!container) return
      const selected = container.querySelector('li[data-selected="true"]') as HTMLElement
      if (!selected) return
      // 선택된 li 가 container 중앙에 오도록 scrollTop 계산
      const offset = selected.offsetTop - container.clientHeight / 2 + selected.clientHeight / 2
      container.scrollTop = offset
    }

    scrollToCenter(hourColumnRef)
    scrollToCenter(minuteColumnRef)
  }, [isOpen])

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger
        type='button'
        onClick={() => {
          onOpenChange(!isOpen)
        }}
      >
        {String(hour).padStart(2, '0')} : {String(minute).padStart(2, '0')}
      </Trigger>
      <Dropdown isOpen={isOpen} ref={dropdownRef} onClick={e => e.stopPropagation()}>
        <Columns>
          <Column ref={hourColumnRef}>
            {Array.from({ length: 24 }, (_, i) => i).map(h => (
              <Option key={h} data-selected={h === hour} selected={h === hour} onClick={() => setHour(h)}>
                {String(h).padStart(2, '0')}
              </Option>
            ))}
          </Column>
          <Column ref={minuteColumnRef} style={{ marginLeft: '2px' }}>
            {Array.from({ length: 6 }, (_, i) => i * 10).map(m => (
              <Option key={m} data-selected={m === minute} selected={m === minute} onClick={() => setMinute(m)}>
                {String(m).padStart(2, '0')}
              </Option>
            ))}
          </Column>
        </Columns>
        <ActionWrapper>
          <ActButton type='button' onClick={handleClose}>
            취소
          </ActButton>
          <ActButton type='button' primary onClick={handleConfirm}>
            확인
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
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.regular};
  color: ${theme.colors.lfBlack.base};
  text-align: start;
  cursor: pointer;
`

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 15px);
  width: 100%;
  background-color: ${theme.colors.lfWhite.base};
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
  position: relative;
`
const Column = styled.ul`
  width: 50%;
  max-height: 150px;
  overflow-y: auto;
  border-right: 1px solid ${theme.colors.lfBlue};
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 3px;
  }
`
const Option = styled.li<{ selected: boolean }>`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  font-size: ${theme.fontSize.sm};
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
