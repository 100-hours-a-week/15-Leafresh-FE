'use client'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { GuideOverlayProps } from '../model/types'
import * as S from './styles'

const GuideOverlay = ({ visible }: GuideOverlayProps) => {
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setShouldRender(false), 500) // fade-out 지속시간 후 제거
      return () => clearTimeout(timer)
    } else {
      setShouldRender(true)
    }
  }, [visible])

  if (!shouldRender) return null

  return (
    <S.Overlay className={!visible ? 'fade-out' : ''}>
      <S.SwipeGuide>
        <ChevronLeft size={24} />
        <span>좌우로 회전해보세요</span>
        <ChevronRight size={24} />
      </S.SwipeGuide>
      <S.DownGuide>
        <ChevronDown size={28} />
        <span>아래로 스와이프하면 닫을 수 있어요</span>
      </S.DownGuide>
    </S.Overlay>
  )
}

export default GuideOverlay
