'use client'

import Image from 'next/image'

import React from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

// 선택 타입 정의
export type SelectionType = 'location' | 'workType' | 'challenge' | 'retry'

export interface ChatSelectionOption {
  label: string
  value: string
}

export interface ChatSelectionProps {
  title: string
  description?: string
  subtitle?: string
  options: ChatSelectionOption[]
  imageUrl?: string
  onSelect: (value: string) => void
  selectionType?: SelectionType // 선택 타입 추가
}

const ChatSelection: React.FC<ChatSelectionProps> = ({
  title,
  description,
  subtitle,
  options,
  imageUrl,
  onSelect,
  selectionType = 'challenge', // 기본값 설정
}) => {
  return (
    <Card data-type={selectionType}>
      {imageUrl && (
        <ImageWrapper data-type={selectionType}>
          <Image
            src={imageUrl}
            alt='cardimg'
            fill={true}
            style={{
              objectFit: 'cover', // 이미지를 컨테이너에 맞게 조절
              objectPosition: 'center', // 이미지 중앙 기준 />
            }}
          />
        </ImageWrapper>
      )}

      <CardContent data-type={selectionType}>
        {title && <CardTitle data-type={selectionType}>{title}</CardTitle>}
        {subtitle && <CardSubtitle data-type={selectionType}>{subtitle}</CardSubtitle>}
        {description && <DescWrapper>{description}</DescWrapper>}

        <OptionsGrid data-type={selectionType}>
          {options.map(option => (
            <OptionButton key={option.value} onClick={() => onSelect(option.value)} data-type={selectionType}>
              {option.label}
            </OptionButton>
          ))}
        </OptionsGrid>
      </CardContent>
    </Card>
  )
}

export default ChatSelection

// 기본 카드 스타일
const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 8px 0;

  &[data-type='challenge'] {
    max-width: 208px;
    height: 213px;
    align-items: center;
  }

  &[data-type='retry'] {
    max-width: 196px;
    /* height: 247px; */
    padding: 15px;
    background: transparent;
    align-items: center;
    white-space: pre-line;
  }
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 109px;
  overflow: hidden;

  /* 재선택 버튼에는 이미지 없음 */
  [data-type='retry'] & {
    display: none;
  }
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
  margin: 5px 0 0 0;
  font-size: ${theme.fontSize.xss};
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};

  /* 챌린지 타입 제목 스타일 */
  [data-type='challenge'] & {
    color: ${theme.colors.lfGreenMain.base};
  }

  /* 재선택 버튼에는 제목 안 보이게 */
  [data-type='retry'] & {
    display: none;
  }
`

const CardSubtitle = styled.p`
  margin: 0;
  align-self: flex-start;
  font-size: 6px;
  color: ${theme.colors.lfGreenMain.base};

  /* 재선택 버튼에는 부제목 안 보이게 */
  [data-type='retry'] & {
    display: none;
  }
`

const DescWrapper = styled.div`
  display: flex;
  color: black;
  font-size: 8px;
`

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin: 12px 0;
  width: 100%;

  [data-type='challenge'] & {
    padding: 0 5px;
  }

  [data-type='retry'] & {
    display: flex;
    justify-content: center;
    grid-template-columns: auto;
  }
`

const OptionButton = styled.button`
  width: 27px;
  height: 23px;
  font-size: 6px;
  color: #27824a;
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

  /* 재선택 버튼 스타일 */
  &[data-type='retry'] {
    align-self: center;
    width: auto;
    height: auto;
    padding: 8px 16px;
    font-size: ${theme.fontSize.md};

    border-radius: 4px;
  }
  &[data-type='challenge'] {
    align-self: center;
    width: 36px;
    height: 23px;
    font-size: 6px;
    border-radius: 4px;
  }
`
