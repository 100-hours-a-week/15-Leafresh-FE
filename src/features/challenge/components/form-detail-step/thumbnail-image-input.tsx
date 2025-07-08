'use client'

import { ChangeEvent, useRef } from 'react'

import styled from '@emotion/styled'

import { LucideIcon } from '@/shared/components'
import { theme } from '@/shared/config'
import { ASPECT_RATIOS } from '@/shared/constants'
import { ToastType } from '@/shared/context'
import { useUploadImageToBucket, useToast, useProcessImageFile } from '@/shared/hooks'

interface UploadThumbnailInputProps {
  imageUrl: string | null
  onChange: (value: { imageUrl: string | null }) => void
}

export const UploadThumbnailInput = ({ imageUrl, onChange }: UploadThumbnailInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { processImageFile } = useProcessImageFile()
  const { uploadFile, loading } = useUploadImageToBucket()
  const openToast = useToast()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const processed = await processImageFile(file, 'thumbnail.jpg')
    if (!processed) {
      openToast(ToastType.Error, '이미지 처리에 실패했습니다')
      return
    }
    try {
      const uploadedUrl = await uploadFile(processed)
      onChange({ imageUrl: uploadedUrl })
      openToast(ToastType.Success, '썸네일 업로드 성공')
    } catch {
      openToast(ToastType.Error, '썸네일 업로드에 실패')
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
  aspect-ratio: ${ASPECT_RATIOS.CHALLENGE_THUMBNAIL};

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
