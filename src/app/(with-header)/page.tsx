'use client'

import { useState } from 'react'

import VerificationImageInput from '@features/challenge/components/verification-image-input/VerificationImageInput'
import ImageInput from '@shared/components/image-input'
import LucideIcon from '@shared/lib/ui/LucideIcon'

const MainPage = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)

  const handleImageUrl = (imageUrl: string | null) => {
    setImageUrl(imageUrl)
  }

  const handleDescription = (description: string | null) => {
    setDescription(description)
  }

  return (
    <>
      {/* CASE1 : 이미지 입력만 받는 경우 (썸네일 이미지 입력) */}
      <ImageInput
        icon={<LucideIcon name='Camera' />}
        label={`인증 성공 예시\n이미지 추가`}
        cameraTitle='친환경 챌린지'
        imageUrl={imageUrl}
        // hasDescription
        // type='FAILURE'
        onImageChange={handleImageUrl}
      />

      <VerificationImageInput
        label={'인증 성공 예시\n이미지 추가'}
        description={description}
        status='SUCCESS'
        imageUrl={imageUrl}
        cameraTitle='종이접기 챌린지'
        onImageChange={handleImageUrl}
        onDescriptionChange={handleDescription}
      />
    </>
  )
}
export default MainPage
