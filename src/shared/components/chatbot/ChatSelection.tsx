'use client'

import Image from 'next/image'

import React, { useMemo } from 'react'
import styled from '@emotion/styled'

import { CHAT_CHALLENGE_OPTIONS, LOCATION_OPSIONS, WORKTYPE_OPTIONS } from '@entities/chatbot/constants'
import { ChatOption } from '@entities/chatbot/type'
import { theme } from '@shared/styles/theme'

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

function ChatSelection({
  selectionType,
  title,
  subtitle,
  imageUrl,
  buttonText,
  onExplainClick,
  onSelect,
}: ChatSelectionProps) {
  const options: ChatOption[] = useMemo(() => {
    if (selectionType === 'location') return LOCATION_OPSIONS
    if (selectionType === 'workType') return WORKTYPE_OPTIONS
    // 'challenge'나 그 외 타입일 때
    return CHAT_CHALLENGE_OPTIONS
  }, [selectionType])

  return (
    <SelectionWrapper>
      <Card data-type={selectionType}>
        {/* cardImageUrl이 있을 때만 Image 컴포넌트를 렌더링 */}
        {imageUrl && (
          <ImageWrapper data-type={selectionType}>
            <CardImage
              src={imageUrl}
              alt={title}
              width={selectionType === 'challenge' ? 250 : 175}
              height={selectionType === 'challenge' ? 120 : 110}
            />
          </ImageWrapper>
        )}

        <CardContent data-type={selectionType}>
          {title && <CardTitle data-type={selectionType}>{title}</CardTitle>}
          {subtitle && <CardSubtitle data-type={selectionType}>{subtitle}</CardSubtitle>}

          <OptionsGrid data-type={selectionType}>
            {options.map((opt: ChatOption) => (
              <OptionButton key={opt.value} data-type={selectionType} onClick={() => onSelect(opt.label)}>
                {opt.label}
              </OptionButton>
            ))}
          </OptionsGrid>

          {buttonText && <ExplainButton onClick={onExplainClick}>{buttonText}</ExplainButton>}
        </CardContent>
      </Card>
    </SelectionWrapper>
  )
}

export default ChatSelection

const SelectionWrapper = styled.div`
  margin: 8px 0;
  padding-left: 40px;
  width: 100%;
`

// 기본 카드 스타일
const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: solid 1px ${theme.colors.lfBlack.base};
  margin: 8px 0;

  &[data-type='challenge'] {
    width: 230px;
    /* height: 260px; */
    align-items: center;
  }
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 110px;
  overflow: hidden;
  object-fit: cover;
  object-position: center;
  &[data-type='challenge'] {
    /* max-width: 250px; */
    height: 120px;
    align-items: center;
  }

  /* 재선택 버튼에는 이미지 없음 */
  [data-type='retry'] & {
    display: none;
  }
`

const CardImage = styled(Image)`
  object-fit: cover;
  object-position: center;
`

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 10px;

  /* 타입별 내용 영역 스타일링 */
  [data-type='retry'] & {
    padding: 0;
  }
`

const CardTitle = styled.h3`
  align-self: flex-start;
  margin: 5px 0 5px 2px;
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};

  /* 챌린지 타입 제목 스타일 */
  [data-type='challenge'] & {
    color: ${theme.colors.lfBlack.base};
  }
`

const CardSubtitle = styled.p`
  margin: 0;
  align-self: flex-start;
  font-size: 10px;
  color: ${theme.colors.lfGreenMain.base};
`

const OptionsGrid = styled.div`
  display: grid;
  align-self: center;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 12px 0;
  width: 100%;
  /* justify-items: center;
  align-items: center; */

  [data-type='challenge'] & {
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    padding: 0 5px;
  }
`

const OptionButton = styled.button`
  width: 70px;
  height: 30px;
  justify-self: center;
  align-self: center;
  font-size: ${theme.fontSize.xss};
  color: ${theme.colors.lfBlack.base};
  font-weight: ${theme.fontWeight.semiBold};
  background: linear-gradient(
    146.15deg,
    rgba(20, 174, 92, 0.38) -2.5%,
    rgba(147, 209, 178, 0.7) 11.55%,
    rgba(173, 221, 194, 0.51) 56.73%,
    rgba(223, 246, 227, 0.62) 85.94%
  );
  box-shadow:
    0px 1px 2px rgba(0, 0, 0, 0.25),
    inset 0px 2px 3px rgba(255, 255, 255, 0.12),
    inset 0px 0.5px 1px rgba(55, 197, 122, 0.17);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d5e9df;
  }

  &:active {
    transform: scale(0.98);
  }
  &[data-type='challenge'] {
    align-self: center;
    width: 45px;
    height: 30px;
    border-radius: 4px;
    font-size: 8px;
    font-weight: ${theme.fontWeight.semiBold};
  }
`

const ExplainButton = styled.button`
  background: linear-gradient(
    146.15deg,
    rgba(20, 174, 92, 0.38) -2.5%,
    rgba(147, 209, 178, 0.7) 11.55%,
    rgba(173, 221, 194, 0.51) 56.73%,
    rgba(223, 246, 227, 0.62) 85.94%
  );
  color: ${theme.colors.lfBlack.base};
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  width: 200px;
  height: 40px;
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.lfPrime};
  align-self: center;
  margin-bottom: 10px;
  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background-color: #d5e9df;
  }

  &:active {
    transform: scale(0.98);
  }
`
