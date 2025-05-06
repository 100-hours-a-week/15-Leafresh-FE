'use client'

import Image from 'next/image'

import { useRef, useState } from 'react'
import styled from '@emotion/styled'

import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

interface ImageInputProps {
  imageUrl?: string
  onChange?: (file: File | null) => void
  className?: string
}

const ImageInput = ({ imageUrl, onChange, className }: ImageInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(imageUrl ?? null)

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    /** TODO : 이미지 업로드 API 연동 */
    // const url = fetch ("POST", 이미지 업로드)
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
      {previewImageUrl ? (
        <PreviewImageView imageUrl={previewImageUrl} onRemove={handleRemoveImage} />
      ) : (
        <EmptyImageView onClick={openFilePicker} />
      )}
      <HiddenInput type='file' accept='image/*' ref={inputRef} onChange={handleFileChange} />
    </Wrapper>
  )
}

export default ImageInput

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

interface EmptyImageViewProps {
  onClick: () => void
}

const EmptyImageView = ({ onClick }: EmptyImageViewProps) => {
  return (
    <EmptyBox onClick={onClick}>
      <LucideIcon name='Plus' size={24} color='lfBlack' />
      <Text>사진 추가하기</Text>
    </EmptyBox>
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

const EmptyBox = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: ${theme.colors.lfGray.base};
  border-radius: ${theme.radius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  cursor: pointer;
`

const Text = styled.p`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
`

const HiddenInput = styled.input`
  display: none;
`
