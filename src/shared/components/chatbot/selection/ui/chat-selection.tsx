'use client'

import React from 'react'

import * as S from './styles'

// 선택 타입 정의
type SelectionType = 'location' | 'workType' | 'challenge' | 'retry'

interface ChatSelectionOption {
  label: string
  value: string
}

interface ChatSelectionProps {
  title: string
  description?: string
  subtitle?: string
  options: ChatSelectionOption[]
  imageUrl?: string
  onSelect: (value: string) => void
  buttonText?: string
  onExplainClick?: () => void
  selectionType?: SelectionType // 선택 타입 추가
}

export const ChatSelection: React.FC<ChatSelectionProps> = ({
  title,
  description,
  subtitle,
  options,
  imageUrl,
  onSelect,
  buttonText,
  onExplainClick,
  selectionType = 'challenge', // 기본값 설정
}) => {
  return (
    <S.Card data-type={selectionType}>
      {imageUrl && (
        <S.ImageWrapper data-type={selectionType}>
          <S.CardImage
            src={imageUrl}
            alt='cardimg'
            // fill={true}
            width={selectionType === 'challenge' ? 250 : 175}
            height={108}
          />
        </S.ImageWrapper>
      )}

      <S.CardContent data-type={selectionType}>
        {title && <S.CardTitle data-type={selectionType}>{title}</S.CardTitle>}
        {subtitle && <S.CardSubtitle data-type={selectionType}>{subtitle}</S.CardSubtitle>}
        {description && <S.DescWrapper>{description}</S.DescWrapper>}

        <S.OptionsGrid data-type={selectionType}>
          {options.map(option => (
            <S.OptionButton key={option.value} onClick={() => onSelect(option.value)} data-type={selectionType}>
              {option.label}
            </S.OptionButton>
          ))}
        </S.OptionsGrid>
        {buttonText && <S.ExplainButton onClick={onExplainClick}>{buttonText}</S.ExplainButton>}
      </S.CardContent>
    </S.Card>
  )
}
