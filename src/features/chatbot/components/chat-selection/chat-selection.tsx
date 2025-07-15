'use client'

import React, { useMemo } from 'react'

import { CHAT_CHALLENGE_OPTIONS, ChatOption, LOCATION_OPSIONS, WORKTYPE_OPTIONS } from '@/entities/chatbot/model'

// <<<<<<< HEAD
// import styled from '@emotion/styled'

// import { CHAT_CHALLENGE_OPTIONS, LOCATION_OPSIONS, WORKTYPE_OPTIONS, ChatOption } from '@/entities/chatbot/model'

// import { theme } from '@/shared/config'
// =======
import * as S from './styles'

export interface ChatSelectionProps {
  selectionType: 'location' | 'workType' | 'challenge' | 'retry'
  title: string
  subtitle?: string
  imageUrl?: string
  options?: ChatOption[]
  buttonText?: string
  onExplainClick?: () => void
  onSelect: (value: string) => void
}

// <<<<<<< HEAD
// export const ChatSelection = ({
// =======
export const ChatSelection: React.FC<ChatSelectionProps> = ({
  selectionType,
  title,
  subtitle,
  imageUrl,
  buttonText,
  onExplainClick,
  onSelect,
}: ChatSelectionProps) => {
  const options: ChatOption[] = useMemo(() => {
    if (selectionType === 'location') return LOCATION_OPSIONS
    if (selectionType === 'workType') return WORKTYPE_OPTIONS
    // 'challenge'나 그 외 타입일 때
    return CHAT_CHALLENGE_OPTIONS
  }, [selectionType])

  return (
    <S.Card data-type={selectionType}>
      {/* cardImageUrl이 있을 때만 Image 컴포넌트를 렌더링 */}
      {imageUrl && (
        <S.ImageWrapper data-type={selectionType}>
          <S.CardImage
            src={imageUrl}
            alt={title}
            width={selectionType === 'challenge' ? 250 : 175}
            height={selectionType === 'challenge' ? 120 : 110}
          />
        </S.ImageWrapper>
      )}

      <S.CardContent data-type={selectionType}>
        {title && <S.CardTitle data-type={selectionType}>{title}</S.CardTitle>}
        {subtitle && <S.CardSubtitle data-type={selectionType}>{subtitle}</S.CardSubtitle>}

        <S.OptionsGrid data-type={selectionType}>
          {options.map((opt: ChatOption) => (
            <S.OptionButton key={opt.value} data-type={selectionType} onClick={() => onSelect(opt.label)}>
              {opt.label}
            </S.OptionButton>
          ))}
        </S.OptionsGrid>

        {buttonText && <S.ExplainButton onClick={onExplainClick}>{buttonText}</S.ExplainButton>}
      </S.CardContent>
    </S.Card>
  )
}
