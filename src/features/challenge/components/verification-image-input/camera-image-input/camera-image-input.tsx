'use client'

import { useState } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import { LucideIcon } from '@/shared/components'
import { theme, ThemeColorType, ThemeFontSizeType } from '@/shared/config'
import { ASPECT_RATIOS, AspectRatioType } from '@/shared/constants'
import { useCameraModalStore } from '@/shared/context'
import { getThemeColor, getThemeFontSize } from '@/shared/lib'

interface CameraImageInputProps {
  icon: React.ReactNode
  label: string
  fontSize?: ThemeFontSizeType
  backgroundColor?: ThemeColorType
  imageUrl: string | null
  aspectRatio?: AspectRatioType

  cameraTitle: string
  hasDescription?: boolean // 해당 이미지에 대한 설명을 받을지 여부
  type?: ChallengeVerificationStatusType

  onZoom: () => void
  onChange: (data: { imageUrl: string | null; description?: string }) => void
  readOnly?: boolean

  className?: string
}

export const CameraImageInput = ({
  icon,
  label,
  fontSize = 'xs',
  backgroundColor = 'lfGray',
  imageUrl, // 외부 관리 상태
  className,
  aspectRatio = 'SQUARE',

  cameraTitle,
  hasDescription = false,
  type = 'SUCCESS',

  onZoom,
  onChange,
  readOnly = false,
}: CameraImageInputProps) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(imageUrl ?? null)
  const { open: openCameraModal } = useCameraModalStore()
  const aspectRatioValue = ASPECT_RATIOS[aspectRatio]

  const handleCapture = () => {
    if (readOnly) return
    openCameraModal(
      // #1. 카메라 모달 제목
      cameraTitle,

      // #2. 이미지 + (설명) 업로드 처리
      ({ imageUrl, description }) => {
        setPreviewImageUrl(imageUrl)
        onChange({ imageUrl, description })
      },

      // #3. 이미지에 대한 설명을 받을지 여부
      hasDescription,

      // #4. 성공 이미지 혹은 실패 이미지
      type,
    )
  }

  const handleRemoveImage = () => {
    if (readOnly) return
    setPreviewImageUrl(null)
    onChange({ imageUrl: null })
  }

  return (
    <Wrapper className={className}>
      {!previewImageUrl ? (
        <EmptyImageView
          onClick={handleCapture}
          icon={icon}
          label={label}
          fontSize={fontSize}
          backgroundColor={backgroundColor}
          readOnly={readOnly}
          aspectRatio={aspectRatioValue}
        />
      ) : (
        <PreviewImageView
          imageUrl={previewImageUrl}
          onRemove={handleRemoveImage}
          readOnly={readOnly}
          aspectRatio={aspectRatioValue}
          onZoom={onZoom}
        />
      )}
    </Wrapper>
  )
}

interface EmptyImageViewProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  fontSize: ThemeFontSizeType
  backgroundColor: ThemeColorType
  readOnly: boolean
  aspectRatio: string
}

const EmptyImageView = ({
  onClick,
  icon,
  label,
  fontSize,
  backgroundColor,
  readOnly,
  aspectRatio,
}: EmptyImageViewProps) => {
  return (
    <EmptyBox onClick={onClick} backgroundColor={backgroundColor} readOnly={readOnly} aspectRatio={aspectRatio}>
      {icon ?? <LucideIcon name='Plus' size={24} color='lfBlack' />}
      <Text fontSize={fontSize}>{label}</Text>
    </EmptyBox>
  )
}

interface PreviewImageViewProps {
  imageUrl: string
  onRemove: () => void
  readOnly: boolean
  aspectRatio: string
  onZoom: () => void
}

const PreviewImageView = ({ imageUrl, onRemove, readOnly, aspectRatio, onZoom }: PreviewImageViewProps) => {
  return (
    <ImageBox aspectRatio={aspectRatio}>
      <PreviewImage alt='preview' src={imageUrl} fill />
      {!readOnly && (
        <RemoveButton type='button' onClick={onRemove}>
          <LucideIcon name='X' size={20} strokeWidth={2.5} color='lfBlack' />
        </RemoveButton>
      )}
      <ZoomButton type='button' onClick={onZoom}>
        <LucideIcon name='Scan' size={24} color='lfWhite' />
      </ZoomButton>
    </ImageBox>
  )
}

// === Styles ===
const Wrapper = styled.div`
  width: 120px;
  position: relative;
  border-radius: ${theme.radius.md};
  overflow: hidden;
`

const ImageBox = styled.div<{ aspectRatio: string }>`
  width: 100%;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadow.lfPrime};

  display: flex;
  align-items: center;
  justify-content: center;
`

const PreviewImage = styled(Image)`
  object-fit: cover;
  object-position: center center;
`

const RemoveButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`

const EmptyBox = styled.div<{ backgroundColor: ThemeColorType; readOnly: boolean; aspectRatio: string }>`
  width: 100%;
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
  background-color: ${({ backgroundColor }) => getThemeColor(backgroundColor)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`

const Text = styled.p<{ fontSize: ThemeFontSizeType }>`
  text-align: center;
  font-size: ${({ fontSize }) => getThemeFontSize(fontSize)};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
  white-space: pre-line;
  line-height: 1.2;
`

const ZoomButton = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`
