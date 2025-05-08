'use client'

import { useState } from 'react'
import styled from '@emotion/styled'

import { theme } from '@shared/styles/theme'

import VerificationImageInput from '../verification-image-input/VerificationImageInput'

interface ChallengeVerifyExamplesProps {
  title: string
  description: string
  maxCount: number
  className?: string
  required?: boolean
}

const ChallengeVerifyExamples = ({
  title,
  description,
  maxCount,
  required,
  className,
}: ChallengeVerifyExamplesProps) => {
  const [images, setImages] = useState<
    {
      url: string | undefined
      type: 'SUCCESS' | 'FAILURE'
    }[]
  >([
    { url: undefined, type: 'SUCCESS' },
    { url: undefined, type: 'FAILURE' },
  ])

  const updateImages = (index: number, imageUrl: string | null, type: 'SUCCESS' | 'FAILURE') => {
    let newImages = [...images]
    const currentCount = newImages.filter(img => img.url !== undefined).length
    // 이미지 추가
    if (imageUrl) {
      newImages[index] = { url: imageUrl, type }

      const hasEmptySlotForType = newImages.some(img => img.url === undefined && img.type === type)

      // 새로운 입력창 추가
      // 현재 type의 빈 인풋이 없고, 최대 개수보다 적다면
      if (!hasEmptySlotForType && currentCount < maxCount) {
        newImages.push({ url: undefined, type })
      }

      // 도달 가능 개수 최대인 경우
      const updatedCount = currentCount + 1

      if (updatedCount === maxCount) {
        newImages = newImages.filter(img => img.url !== undefined)
      }
    }
    // 이미지 삭제
    else {
      newImages.splice(index, 1)

      const updatedCount = currentCount - 1
      // 삭제 후 type별 빈 인풋이 없으면 새로 추가
      const hasEmptySlotForSuccess = newImages.some(img => img.url === undefined && img.type === 'SUCCESS')
      if (!hasEmptySlotForSuccess && updatedCount < maxCount) {
        newImages.push({ url: undefined, type: 'SUCCESS' })
      }

      const hasEmptySlotForFailure = newImages.some(img => img.url === undefined && img.type === 'FAILURE')
      if (!hasEmptySlotForFailure && updatedCount < maxCount) {
        newImages.push({ url: undefined, type: 'FAILURE' })
      }
    }

    newImages.sort((a, b) => {
      const aUploaded = a.url !== undefined
      const bUploaded = b.url !== undefined

      // 1. 업로드된 이미지가 먼저
      if (aUploaded !== bUploaded) {
        return aUploaded ? -1 : 1
      }

      // 2. 업로드 여부가 같다면 SUCCESS 먼저
      if (a.type === b.type) return 0
      return a.type === 'SUCCESS' ? -1 : 1
    })
    setImages(newImages)
  }

  return (
    <Wrapper className={className}>
      <Header>
        <Label>
          {title}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      </Header>
      <Description>{description}</Description>

      <ScrollArea>
        {images.map((img, idx) => (
          <VerificationImageInput
            key={`${img.type}-${idx}`}
            label={`인증 ${img.type === 'SUCCESS' ? '성공' : '실패'} 예시\n이미지 추가`}
            description={`${img.type === 'SUCCESS' ? '성공' : '실패'} 인증샷 설명`}
            status={img.type}
            imageUrl={img.url}
            onChange={file => updateImages(idx, file, img.type)}
          />
        ))}
      </ScrollArea>
    </Wrapper>
  )
}

export default ChallengeVerifyExamples

// === Styles ===
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Label = styled.h3`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.lfBlack.base};
`

const RequiredMark = styled.span`
  color: ${theme.colors.lfGreenBorder.base};
`

const Description = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.lfGreenMain.base};
`

const ScrollArea = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
`
