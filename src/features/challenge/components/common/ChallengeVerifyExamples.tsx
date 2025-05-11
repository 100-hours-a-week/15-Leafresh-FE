'use client'

import styled from '@emotion/styled'

import { CHALLENGE_VERIFICATION_RESULT } from '@entities/challenge/constant'
import { ChallengeVerificationResultType } from '@entities/challenge/type'
import { theme } from '@shared/styles/theme'

import VerificationImageInput from './VerificationImageInput'

export interface VerificationImageData {
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
  className?: string
  readOnly?: boolean
  required?: boolean
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
}: ChallengeVerifyExamplesProps) => {
  const updateExamples = (
    index: number,
    data: Partial<Omit<VerificationImageData, 'type'>>,
    type: ChallengeVerificationResultType,
  ) => {
    if (readOnly) return

    let newExamples = [...examples]
    const currentCount = newExamples.filter(e => e.url !== null).length

    newExamples[index] = {
      ...newExamples[index],
      ...data,
      type,
    }

    if (data.url !== undefined && data.url !== null) {
      const hasEmptySlot = newExamples.some(e => e.url === null && e.type === type)
      if (!hasEmptySlot && currentCount < maxCount) {
        newExamples.push({ url: null, description: '', type })
      }

      if (currentCount + 1 === maxCount) {
        newExamples = newExamples.filter(e => e.url !== null)
      }
    }

    /** 이미지 입력창 1개만 두기 */
    for (const result_type of CHALLENGE_VERIFICATION_RESULT) {
      const emptyItems = newExamples.filter(e => e.url === null && e.type === result_type)
      if (emptyItems.length > 1) {
        const firstIndex = newExamples.findIndex(e => e === emptyItems[0])
        newExamples = newExamples.filter((e, idx) => e.url !== null || e.type !== result_type || idx === firstIndex)
      }
    }

    /** 성공 이미지 > 실패 이미지 > 성공 입력창 > 실패 입력창 */
    newExamples.sort((a, b) => {
      const aUploaded = a.url !== null
      const bUploaded = b.url !== null
      if (aUploaded !== bUploaded) return aUploaded ? -1 : 1
      return a.type === 'SUCCESS' ? -1 : 1
    })

    onChange(newExamples)
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
        {examples.map((example, idx) => (
          <VerificationImageInput
            key={`${example.type}-${idx}`}
            label={`인증 ${example.type === 'SUCCESS' ? '성공' : '실패'} 예시\n이미지 추가`}
            imageUrl={example.url}
            description={example.description}
            cameraTitle={example.type === 'SUCCESS' ? '성공 예시 이미지' : '실패 예시 이미지'}
            status={example.type}
            readOnly={readOnly}
            onChange={({ imageUrl, description }) =>
              updateExamples(idx, { url: imageUrl, description: description ?? '' }, example.type)
            }
          />
        ))}
      </ScrollArea>
    </Wrapper>
  )
}

export default ChallengeVerifyExamples

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
