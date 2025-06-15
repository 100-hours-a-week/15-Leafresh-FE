'use client'

import { AnimatePresence } from 'motion/react'
import { useState } from 'react'

import {
  getGroupChallengeRulesList,
  GroupChallengeRulesListResponse,
} from '@entities/challenge/api/group/get-group-rules'
import {
  getPersonalChallengeRulesList,
  PersonalChallengeRulesListResponse,
} from '@entities/challenge/api/personal/get-personal-rules'
import { convertLanguage } from '@entities/challenge/model'
import { DAY_PAIRS } from '@entities/common'
import { Loading } from '@shared/components/loading'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ChallengeDataType } from '@shared/context/modal/CameraModalStore'
import { ApiResponse } from '@shared/lib/api/type'
import LucideIcon from '@shared/lib/ui/LucideIcon'

import * as S from './styles'

import { useQuery } from '@tanstack/react-query'

interface VerificationGuideModalProps {
  isOpen: boolean
  challengeData: ChallengeDataType
  onClose: () => void
}

export const VerificationGuideModal = ({ isOpen, challengeData, onClose }: VerificationGuideModalProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false)

  const { id: challengeId, type } = challengeData

  type ChallengeRulesListResponse = GroupChallengeRulesListResponse | PersonalChallengeRulesListResponse
  let queryKey
  let queryFn
  let queryDefaults
  switch (type) {
    case 'GROUP':
      queryKey = QUERY_KEYS.CHALLENGE.GROUP.RULES(challengeId)
      queryFn = () => getGroupChallengeRulesList(challengeId)
      queryDefaults = QUERY_OPTIONS.CHALLENGE.GROUP.RULES
      break
    case 'PERSONAL':
      queryKey = QUERY_KEYS.CHALLENGE.PERSONAL.RULES(challengeId)
      queryFn = () => getPersonalChallengeRulesList(challengeId)
      queryDefaults = QUERY_OPTIONS.CHALLENGE.PERSONAL.RULES
      break
  }

  const { data, isLoading } = useQuery<ApiResponse<ChallengeRulesListResponse>>({
    queryKey,
    queryFn,
    ...queryDefaults,
  })

  let contents
  if (isLoading) {
    contents = <Loading />
  }
  if (data) {
    const { certificationPeriod, exampleImages } = data.data

    let periodText = ''
    if (type === 'GROUP') {
      const groupPeriod = certificationPeriod as GroupChallengeRulesListResponse['certificationPeriod']
      periodText = `${groupPeriod.startDate.slice(2)} ~ ${groupPeriod.endDate.slice(2)}`
    } else {
      const personalPeriod = certificationPeriod as PersonalChallengeRulesListResponse['certificationPeriod']
      periodText = convertLanguage(DAY_PAIRS, 'eng', 'kor')(personalPeriod.dayOfWeek) as string
    }

    const timeText = `${certificationPeriod.startTime} ~ ${certificationPeriod.endTime}`

    const today = new Date()
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const date = today.getDate().toString().padStart(2, '0')
    const weekday = today.toLocaleDateString('ko-KR', { weekday: 'long' })
    const todayLabel = `오늘 (${weekday}, ${month}-${date})`

    contents = (
      <>
        <S.StyledChallengeVerifyExamples
          title='인증샷 예시 *'
          description='* 해당 인증샷은 실제 검증모델에 사용되지 않는 참고용 사진입니다.'
          maxCount={5}
          readOnly
          examples={
            exampleImages.map(e => ({
              url: e.imageUrl,
              description: e.description,
              type: e.type,
            })) ?? []
          }
          onChange={() => {}}
          verificationInputClassName='verify-input'
        />

        <S.InfoSection>
          <S.InfoTitle>챌린지 인증 정보</S.InfoTitle>
          <S.InfoItem>
            <div className='left'>
              <LucideIcon name='Check' size={24} />
              <span>인증 가능 날짜</span>
            </div>
            <strong>{type === 'GROUP' ? periodText : todayLabel}</strong>
          </S.InfoItem>

          <S.InfoItem>
            <div className='left'>
              <LucideIcon name='Check' size={24} />
              <span>인증 가능 시간</span>
            </div>
            <strong>{timeText}</strong>
          </S.InfoItem>
        </S.InfoSection>
      </>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <S.Overlay onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <S.MotionWrapper
            drag='y'
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose()
              }
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <S.DragBar isHover={isHovering} />
            <S.GuideHeader>
              인증 방법
              <S.CloseButton onClick={onClose}>
                <LucideIcon name='X' size={24} />
              </S.CloseButton>
            </S.GuideHeader>
            <S.GuideContent>{contents}</S.GuideContent>
          </S.MotionWrapper>
        </S.Overlay>
      )}
    </AnimatePresence>
  )
}
