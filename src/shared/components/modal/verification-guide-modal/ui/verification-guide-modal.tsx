'use client'

import { AnimatePresence, motion } from 'motion/react'

import { useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { convertLanguage, DAY_PAIRS } from '@entities/challenge/constant'
import {
  getGroupChallengeRulesList,
  GroupChallengeRulesListResponse,
} from '@features/challenge/api/get-group-challenge-rules'
import {
  getPersonalChallengeRulesList,
  PersonalChallengeRulesListResponse,
} from '@features/challenge/api/get-personal-challenge-rules'
import ChallengeVerifyExamples from '@features/challenge/components/common/ChallengeVerifyExamples'
import Loading from '@shared/components/loading/ui/loading'
import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import { theme } from '@shared/config/style/theme'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { ChallengeDataType } from '@shared/context/modal/camera-modal-store'
import { ApiResponse } from '@shared/lib/api/type'
import { extractDateFromISOInKST } from '@shared/lib/date/utils'

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
      periodText = `${extractDateFromISOInKST(groupPeriod.startDate).slice(2, -1)} ~ ${extractDateFromISOInKST(groupPeriod.endDate).slice(2, -1)}`
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
        <StyledChallengeVerifyExamples
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

        <InfoSection>
          <InfoTitle>챌린지 인증 정보</InfoTitle>
          <InfoItem>
            <div className='left'>
              <LucideIcon name='Check' size={24} />
              <span>인증 가능 날짜</span>
            </div>
            <strong>{type === 'GROUP' ? periodText : todayLabel}</strong>
          </InfoItem>

          <InfoItem>
            <div className='left'>
              <LucideIcon name='Check' size={24} />
              <span>인증 가능 시간</span>
            </div>
            <strong>{timeText}</strong>
          </InfoItem>
        </InfoSection>
      </>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <MotionWrapper
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
            <DragBar isHover={isHovering} />
            <GuideHeader>
              인증 방법
              <CloseButton onClick={onClose}>
                <LucideIcon name='X' size={24} />
              </CloseButton>
            </GuideHeader>
            <GuideContent>{contents}</GuideContent>
          </MotionWrapper>
        </Overlay>
      )}
    </AnimatePresence>
  )
}
const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px);
  z-index: 999;
`

const MotionWrapper = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80%;

  display: flex;
  flex-direction: column;
  border-top-left-radius: ${theme.radius.xl};
  border-top-right-radius: ${theme.radius.xl};
  background: ${theme.colors.lfWhite.base};
  box-shadow: ${theme.shadow.lfPrime};
  z-index: 300;
`
const DragBar = styled.div<{ isHover: boolean }>`
  width: 60px;
  height: 6px;
  border-radius: 4px;
  background: ${theme.colors.lfGray.base};
  margin: 8px auto 12px;

  background: ${({ isHover }) => (isHover ? theme.colors.lfDarkGray.base : theme.colors.lfGray.base)};
  transition: background-color 0.2s ease;
`

const GuideHeader = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`

const GuideContent = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
  overscroll-behavior: contain;
`

const StyledChallengeVerifyExamples = styled(ChallengeVerifyExamples)`
  padding: 20px 30px 0px 30px;
  font-weight: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.xl};
  .verify-input {
    width: 40%;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
`

const InfoSection = styled.div`
  width: 100%;
  border-top: 4px solid ${theme.colors.lfLightGray.base};
  margin-top: 24px;
  padding: 45px 30px 0 30px;
`

const InfoTitle = styled.h4`
  font-weight: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.md};
  margin-bottom: 16px;
`

const InfoItem = styled.div`
  padding-left: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  margin-bottom: 12px;
  .left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  strong {
    font-weight: ${theme.fontWeight.medium};
  }
`
