'use client'

import Image from 'next/image'

import { useState } from 'react'
import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import { ThemeColorType, ThemeFontSizeType } from '@shared/styles/theme/type'
import { getThemeColor, getThemeFontSize } from '@shared/styles/theme/utils'

interface ImageInputProps {
  icon: React.ReactNode
  label: string
  fontSize?: ThemeFontSizeType
  backgroundColor?: ThemeColorType
  imageUrl: string | null

  cameraTitle: string
  hasDescription?: boolean // 해당 이미지에 대한 설명을 받을지 여부
  type?: ChallengeVerificationStatusType

  onImageChange: (imageUrl: string | null) => void
  onDescriptionChange?: (description: string | null) => void

  className?: string
}

const ImageInput = ({
  icon,
  label,
  fontSize = 'xs',
  backgroundColor = 'lfGray',
  imageUrl, // 외부 관리 상태
  onImageChange,
  className,

  cameraTitle,
  hasDescription = false,
  type = 'SUCCESS',
  onDescriptionChange,
}: ImageInputProps) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(imageUrl ?? null)
  const { open: openCameraModal } = useCameraModalStore()

  const handleCapture = () => {
    openCameraModal(
      // #1. 카메라 모달 제목
      cameraTitle,

      // #2. 이미지 업로드 처리
      (imageUrl: string) => {
        setPreviewImageUrl(imageUrl)
        onImageChange(imageUrl)
      },

      // #3. 설명 업로드 처리
      (description: string) => {
        onDescriptionChange?.(description)
      },
      hasDescription, // 이미지에 대한 설명을 받을지 여부
      type, // 성공 이미지 혹은 실패 이미지
    )
  }

  const handleRemoveImage = () => {
    setPreviewImageUrl(null)
    onImageChange?.(null)
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
        />
      ) : (
        <PreviewImageView imageUrl={previewImageUrl} onRemove={handleRemoveImage} />
      )}
    </Wrapper>
  )
}

export default ImageInput

interface EmptyImageViewProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  fontSize: ThemeFontSizeType
  backgroundColor: ThemeColorType
}

const EmptyImageView = ({ onClick, icon, label, fontSize, backgroundColor }: EmptyImageViewProps) => {
  return (
    <EmptyBox onClick={onClick} backgroundColor={backgroundColor}>
      {icon ?? <LucideIcon name='Plus' size={24} color='lfBlack' />}
      <Text fontSize={fontSize}>{label}</Text>
    </EmptyBox>
  )
}

interface PreviewImageViewProps {
  imageUrl: string
  onRemove: () => void
}

const PreviewImageView = ({ imageUrl, onRemove }: PreviewImageViewProps) => {
  return (
    <ImageBox>
      <Image alt='preview' src={imageUrl} fill style={{ objectFit: 'cover' }} sizes='120px' />
      <RemoveButton type='button' onClick={onRemove}>
        <LucideIcon name='X' size={20} strokeWidth={2.5} color='lfBlack' />
      </RemoveButton>
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

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadow.lfPrime};
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

const EmptyBox = styled.div<{ backgroundColor: ThemeColorType }>`
  width: 100%;
  aspect-ratio: 1 / 1;
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
