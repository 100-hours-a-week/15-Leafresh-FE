'use client'

import { ChangeEvent, useRef } from 'react'

import styled from '@emotion/styled'

import { LucideIcon } from '@/shared/components'
import { theme } from '@/shared/config'
import { ToastType } from '@/shared/context'
import { useImageUpload, useToast } from '@/shared/hooks'

interface UploadThumbnailInputProps {
  imageUrl: string | null
  onChange: (value: { imageUrl: string | null }) => void
}

export const UploadThumbnailInput = ({ imageUrl, onChange }: UploadThumbnailInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { uploadFile, loading } = useImageUpload()
  const openToast = useToast()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageBitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      canvas.width = imageBitmap.width
      canvas.height = imageBitmap.height

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('캔버스 컨텍스트 생성 실패')

      ctx.drawImage(imageBitmap, 0, 0)
      canvas.toBlob(async blob => {
        if (!blob) return
        const newFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' })
        const uploadedUrl = await uploadFile(newFile)
        onChange({ imageUrl: uploadedUrl })
        openToast(ToastType.Success, '썸네일 업로드 성공')
      }, 'image/jpeg')
    } catch {
      openToast(ToastType.Error, '썸네일 업로드 실패')
    }
  }

  return (
    <ThumbnailContainer onClick={() => inputRef.current?.click()}>
      {imageUrl ? (
        <Thumbnail src={imageUrl} alt='썸네일 미리보기' />
      ) : (
        <Overlay>
          <LucideIcon name='Image' size={24} />
          이미지를 업로드해주세요
        </Overlay>
      )}
      <HiddenInput type='file' accept='image/*' onChange={handleFileChange} ref={inputRef} disabled={loading} />
    </ThumbnailContainer>
  )
}

const ThumbnailContainer = styled.div`
  width: 100%;
  aspect-ratio: 5/3;

  border: 1px solid ${theme.colors.lfGray.base};
  border-radius: ${theme.radius.base};

  position: relative;
  cursor: pointer;
  overflow: hidden;
`

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Overlay = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfBlack.base};

  display: flex;
  flex-direction: column;
  gap: 8px;

  position: absolute;
`

const HiddenInput = styled.input`
  display: none;
`
