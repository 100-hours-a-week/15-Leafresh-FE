'use client'

import { useEffect } from 'react'
import styled from '@emotion/styled'

import { CHALLENGE_VERIFICATION_RESULT } from '@entities/challenge/constant'
import { ChallengeVerificationResultType } from '@entities/challenge/type'
import { ImageZoomModalData, useImageZoomStore } from '@shared/context/zoom-modal/ImageZoomStore'
import { theme } from '@shared/styles/theme'

import VerificationImageInput from './VerificationImageInput'

export interface VerificationImageData {
  id?: number
  url: string | null
  description: string
  type: ChallengeVerificationResultType
}

interface ChallengeVerifyExamplesProps {
  title: string
  description: string
  maxCount: number
  examples: VerificationImageData[]
  onChange: (updated: VerificationImageData[]) => void
  readOnly?: boolean
  required?: boolean
  className?: string
  verificationInputClassName?: string
}

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

    if (targetIndex === -1) return // 보호 코드

    let newExamples = [...examples]
    const currentCount = newExamples.filter(e => e.url !== null).length

    newExamples[targetIndex] = {
      ...(data.url === null ? {} : { id: newExamples[targetIndex].id }), // 삭제 시 id 제거
      ...newExamples[targetIndex],
      ...data,
      type,
    }

    console.log('after: ', newExamples)

    /** Case: 이미지가 추가된 경우 이미지 입력창을 추가 */
    if (data.url !== undefined && data.url !== null) {
      const hasEmptySlot = newExamples.some(e => !e.id && e.url === null && e.type === type)
      if (!hasEmptySlot && currentCount < maxCount) {
        newExamples.push({ url: null, description: '', type })
      }

      if (currentCount + 1 === maxCount) {
        newExamples = newExamples.filter(e => e.url !== null)
      }
    }

    console.log('after1: ', newExamples)

    /** 이미지 입력창 1개만 두기 */
    for (const result_type of CHALLENGE_VERIFICATION_RESULT) {
      const emptyItems = newExamples.filter(e => !e.id && e.url === null && e.type === result_type)
      if (emptyItems.length > 1) {
        const firstIndex = newExamples.findIndex(e => e === emptyItems[0])
        newExamples = newExamples.filter((e, idx) => e.url !== null || e.type !== result_type || idx === firstIndex)
      }
    }

    console.log('after2: ', newExamples)

    /** 성공 이미지 > 실패 이미지 > 성공 입력창 > 실패 입력창 */
    newExamples.sort((a, b) => {
      const aUploaded = a.url !== null
      const bUploaded = b.url !== null
      if (aUploaded !== bUploaded) return aUploaded ? -1 : 1
      return a.type === 'SUCCESS' ? -1 : 1
    })

    console.log('after3: ', newExamples)

    onChange(newExamples)
  }

  /** 이미지 확대클릭 */
  const handleZoomClick = (example: VerificationImageData, idx: number) => {
    const { url, description, type } = example
    if (!url || !description) return

    const data: ImageZoomModalData[] = examples.map(
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
    <Wrapper className={className}>
      <Header>
        <Label>
          {title}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      </Header>
      {description && <Description>{description}</Description>}

      <ScrollArea>
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
      </ScrollArea>
    </Wrapper>
  )
}

export default ChallengeVerifyExamples

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Label = styled.h3`
  font-size: ${theme.fontSize.md};
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
  width: 100%;

  position: relative;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
`
