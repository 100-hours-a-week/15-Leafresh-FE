'use client'

import { useEffect, useRef, useState } from 'react'

import * as S from './styles'

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
    <S.Wrapper ref={wrapperRef}>
      <S.Trigger
        type='button'
        onClick={() => {
          onOpenChange(!isOpen)
        }}
      >
        {String(hour).padStart(2, '0')} : {String(minute).padStart(2, '0')}
      </S.Trigger>
      <S.Dropdown isOpen={isOpen} ref={dropdownRef} onClick={e => e.stopPropagation()}>
        <S.Columns>
          <S.Column ref={hourColumnRef}>
            {Array.from({ length: 24 }, (_, i) => i).map(h => (
              <S.Option key={h} data-selected={h === hour} selected={h === hour} onClick={() => setHour(h)}>
                {String(h).padStart(2, '0')}
              </S.Option>
            ))}
          </S.Column>
          <S.Column ref={minuteColumnRef} style={{ marginLeft: '2px' }}>
            {Array.from({ length: 6 }, (_, i) => i * 10).map(m => (
              <S.Option key={m} data-selected={m === minute} selected={m === minute} onClick={() => setMinute(m)}>
                {String(m).padStart(2, '0')}
              </S.Option>
            ))}
          </S.Column>
        </S.Columns>
        <S.ActionWrapper>
          <S.ActButton type='button' onClick={handleClose}>
            취소
          </S.ActButton>
          <S.ActButton type='button' primary onClick={handleConfirm}>
            확인
          </S.ActButton>
        </S.ActionWrapper>
      </S.Dropdown>
    </S.Wrapper>
  )
}
