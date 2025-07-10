'use client'

import { ChangeEvent, useRef } from 'react'

import { LucideIcon } from '@/shared/components'
import { useUploadImageToBucket, useToast, useProcessImageFile } from '@/shared/hooks'

import * as S from './styles'

interface UploadThumbnailInputProps {
  imageUrl: string | null
  onChange: (value: { imageUrl: string | null }) => void
}

export const UploadThumbnailInput = ({ imageUrl, onChange }: UploadThumbnailInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { processImageFile } = useProcessImageFile()
  const { uploadFile, loading } = useUploadImageToBucket()
  const { toast } = useToast()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const processed = await processImageFile(file, 'thumbnail.jpg')
    if (!processed) {
      toast('Error', '이미지 처리에 실패했습니다')
      return
    }
    try {
      const uploadedUrl = await uploadFile(processed)
      onChange({ imageUrl: uploadedUrl })
      toast('Success', '썸네일 업로드 성공')
    } catch {
      toast('Error', '썸네일 업로드에 실패')
    }
  }

  return (
    <S.ThumbnailContainer onClick={() => inputRef.current?.click()}>
      {imageUrl ? (
        <S.Thumbnail src={imageUrl} alt='썸네일 미리보기' />
      ) : (
        <S.Overlay>
          <LucideIcon name='Image' size={24} />
          이미지를 업로드해주세요
        </S.Overlay>
      )}
      <S.HiddenInput type='file' accept='image/*' onChange={handleFileChange} ref={inputRef} disabled={loading} />
    </S.ThumbnailContainer>
  )
}
