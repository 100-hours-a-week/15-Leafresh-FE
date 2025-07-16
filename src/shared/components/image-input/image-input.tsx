'use client'

import { useState } from 'react'

import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import { LucideIcon } from '@/shared/components'
import { ThemeColorType, ThemeFontSizeType } from '@/shared/config'
import { ASPECT_RATIOS, AspectRatioType } from '@/shared/constants'
import { useCameraModalStore } from '@/shared/context'

import * as S from './styles'

interface ImageInputProps {
  icon: React.ReactNode
  label: string
  fontSize?: ThemeFontSizeType
  backgroundColor?: ThemeColorType
  imageUrl: string | null
  aspectRatio?: AspectRatioType

  cameraTitle: string
  hasDescription?: boolean // 해당 이미지에 대한 설명을 받을지 여부
  type?: ChallengeVerificationStatusType // TODO:(component) @entities/ 를 받아오므로, 확장성있는 공통 컴포넌트로 설계하지 않은 거임

  onChange: (data: { imageUrl: string | null; description?: string }) => void
  readOnly?: boolean

  className?: string
}

export const ImageInput = ({
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

  readOnly = false,
  onChange,
}: ImageInputProps) => {
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
    <S.Wrapper className={className}>
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
        />
      )}
    </S.Wrapper>
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
    <S.EmptyBox onClick={onClick} backgroundColor={backgroundColor} readOnly={readOnly} aspectRatio={aspectRatio}>
      {icon ?? <LucideIcon name='Plus' size={24} color='lfBlack' />}
      <S.Text fontSize={fontSize}>{label}</S.Text>
    </S.EmptyBox>
  )
}

interface PreviewImageViewProps {
  imageUrl: string
  onRemove: () => void
  readOnly: boolean
  aspectRatio: string
}

const PreviewImageView = ({ imageUrl, onRemove, readOnly, aspectRatio }: PreviewImageViewProps) => {
  return (
    <S.ImageBox aspectRatio={aspectRatio}>
      <S.PreviewImage alt='preview' src={imageUrl} fill sizes='(max-width: 900px) 30vw, 120px' quality={80} />
      {!readOnly && (
        <S.RemoveButton type='button' onClick={onRemove}>
          <LucideIcon name='X' size={20} strokeWidth={2.5} color='lfBlack' />
        </S.RemoveButton>
      )}
    </S.ImageBox>
  )
}
