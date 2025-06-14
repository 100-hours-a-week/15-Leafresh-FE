'use client'

import { useEffect } from 'react'

import { CHALLENGE_VERIFICATION_RESULT, ChallengeVerificationResultType } from '@entities/challenge/model'
import { ImageZoomModalData, useImageZoomStore } from '@shared/context/zoom-modal/ImageZoomStore'

import VerificationImageInput from '../../verification-image-input/ui/verification-image-input'
import { ChallengeVerifyExamplesProps, VerificationImageData } from '../model/types'
import * as S from './styles'

const ChallengeVerifyExamples = ({
  title,
  description,
  maxCount,
  examples,
  onChange,
  readOnly = false,
  required,
  className,
  verificationInputClassName,
}: ChallengeVerifyExamplesProps) => {
  const { open } = useImageZoomStore()

  /** 데이터 페칭을 통해 받은 examples 에는 입력을 위한 데이터가 없을 수 있으므로 추가가 필요함 */
  useEffect(() => {
    if (readOnly) return

    const nextExamples = [...examples]

    for (const type of CHALLENGE_VERIFICATION_RESULT) {
      const hasInputSlot = nextExamples.some(e => e.type === type && e.url === null)
      if (!hasInputSlot) {
        nextExamples.push({ url: null, description: '', type })
      }
    }

    // 변경된 경우만 onChange 호출
    if (nextExamples.length !== examples.length) {
      onChange(nextExamples)
    }
  }, [])

  const updateExamples = (
    index: number,
    data: Partial<Omit<VerificationImageData, 'type'>>,
    type: ChallengeVerificationResultType,
  ) => {
    if (readOnly) return

    const visibleExamples = examples.filter(e => !(e.id && !e.url))
    const target = visibleExamples[index]
    const targetIndex = examples.findIndex(e => e === target)

    if (targetIndex === -1) return

    let newExamples = [...examples]

    // 1. 이미지가 있었는데 삭제됨 (url: '...', data.url === null)
    if (newExamples[targetIndex].url && data.url === null) {
      newExamples.splice(targetIndex, 1)
    } else {
      // 2. 이미지 추가
      newExamples[targetIndex] = {
        ...(data.url === null
          ? {} // 삭제된 경우: id 제거
          : newExamples[targetIndex].id !== undefined
            ? { id: newExamples[targetIndex].id } // id 유지
            : {}), // 새로 추가된 경우: id 없음
        ...newExamples[targetIndex],
        ...data,
        type,
      }
    }

    // 3. 이미지가 추가되면 dummy 하나 더 추가
    const currentCount = newExamples.filter(e => e.url !== null).length
    if (data.url !== undefined && data.url !== null) {
      const hasEmptySlot = newExamples.some(e => !e.id && e.url === null && e.type === type)
      if (!hasEmptySlot && currentCount < maxCount) {
        newExamples.push({ url: null, description: '', type })
      }

      if (currentCount + 1 === maxCount) {
        newExamples = newExamples.filter(e => e.url !== null)
      }
    }

    // 4. 입력창은 타입별 하나만
    for (const result_type of CHALLENGE_VERIFICATION_RESULT) {
      const emptyItems = newExamples.filter(e => !e.id && e.url === null && e.type === result_type)
      if (emptyItems.length > 1) {
        const firstIndex = newExamples.findIndex(e => e === emptyItems[0])
        newExamples = newExamples.filter((e, idx) => e.url !== null || e.type !== result_type || idx === firstIndex)
      }
    }

    // 5. 정렬
    newExamples.sort((a, b) => {
      const aUploaded = a.url !== null
      const bUploaded = b.url !== null
      if (aUploaded !== bUploaded) return aUploaded ? -1 : 1
      return a.type === 'SUCCESS' ? -1 : 1
    })

    onChange(newExamples)
  }

  /** 이미지 확대클릭 */
  const handleZoomClick = (example: VerificationImageData, idx: number) => {
    const { url, description, type } = example

    /** 확대 불가능 이미지인 경우 */
    if (!url || !description) return

    /** 이미지가 있는 예시만 확대 */
    const hasImageExamples: VerificationImageData[] = examples.filter(example => example.url && example.description)
    const data: ImageZoomModalData[] = hasImageExamples.map(
      example =>
        ({
          result: example.type,
          imageSrc: example.url,
          description: example.description,
        }) as ImageZoomModalData,
    )
    /** 모달 열기 */
    open(data, idx)
  }

  return (
    <S.Wrapper className={className}>
      <S.Header>
        <S.Label>
          {title}
          {required && <S.RequiredMark>*</S.RequiredMark>}
        </S.Label>
      </S.Header>
      {description && <S.Description>{description}</S.Description>}

      <S.ScrollArea>
        {examples
          /** 보존용 데이터는 보여주지 않음 (단체 챌린지 수정 과정) */
          .filter(example => !(example.id && !example.url))
          .map((example, idx) => {
            return (
              <VerificationImageInput
                key={example.url ?? `${example.type}-${idx}`}
                label={`인증 ${example.type === 'SUCCESS' ? '성공' : '실패'} 예시\n이미지 추가`}
                imageUrl={example.url}
                description={example.description}
                cameraTitle={example.type === 'SUCCESS' ? '성공 예시 이미지' : '실패 예시 이미지'}
                status={example.type}
                readOnly={readOnly}
                onChange={({ imageUrl, description }) =>
                  updateExamples(idx, { url: imageUrl, description: description ?? '' }, example.type)
                }
                onZoom={() => handleZoomClick(example, idx)}
                className={verificationInputClassName}
              />
            )
          })}
      </S.ScrollArea>
    </S.Wrapper>
  )
}

export default ChallengeVerifyExamples
