'use client'

import Image from 'next/image'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'

import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import { ThemeColorType, ThemeFontSizeType } from '@shared/styles/theme/type'
import { getThemeColor, getThemeFontSize } from '@shared/styles/theme/utils'

interface ImageInputProps {
  icon: React.ReactNode
  label: string
  fontSize?: ThemeFontSizeType
  imageUrl?: string
  onChange?: (file: File | null) => void
  backgroundColor?: ThemeColorType
  className?: string
}

const ImageInput = ({
  imageUrl,
  onChange,
  className,
  icon,
  label,
  fontSize = 'xs',
  backgroundColor = 'lfGray',
}: ImageInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(imageUrl ?? null)

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPreviewImageUrl(url)
    onChange?.(file)
  }

  const handleRemoveImage = () => {
    setPreviewImageUrl(null)
    inputRef.current!.value = ''
    onChange?.(null)
  }

  return (
    <Wrapper className={className}>
      {!previewImageUrl ? (
        <EmptyImageView
          onClick={openFilePicker}
          icon={icon}
          label={label}
          fontSize={fontSize}
          backgroundColor={backgroundColor}
        />
      ) : (
        <PreviewImageView imageUrl={previewImageUrl} onRemove={handleRemoveImage} />
      )}
      <HiddenInput type='file' accept='image/*' ref={inputRef} onChange={handleFileChange} />
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
`

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  border-radius: ${theme.radius.sm};
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
  border-radius: ${theme.radius.md};
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

const HiddenInput = styled.input`
  display: none;
`
