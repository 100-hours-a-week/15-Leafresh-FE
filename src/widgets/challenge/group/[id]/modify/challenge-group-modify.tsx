'use client'

import { ReactNode } from 'react'

import { useQuery } from '@tanstack/react-query'

import { getGroupChallengeDetails } from '@/entities/challenge/api'
import {
  CHALLENGE_CATEGORY_PAIRS,
  ChallengeCategoryTypeKor,
  convertLanguage,
  FullFormValues,
} from '@/entities/challenge/model'

import { QUERY_KEYS, QUERY_OPTIONS } from '@/shared/config'

import { GroupChallengeFormPage } from '../../form'

interface ChallengeGroupModifyPageProps {
  challengeId: number
}

export const ChallengeGroupModifyPage = ({ challengeId }: ChallengeGroupModifyPageProps): ReactNode => {
  /** 단체 챌린지 상세 가져오기 */
  const { data: challengeData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.DETAILS(challengeId),
    queryFn: () => getGroupChallengeDetails(challengeId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.DETAILS,
  })

  let contents
  if (challengeData) {
    const {
      id,
      category,
      title,
      description,
      startDate,
      endDate,
      verificationStartTime,
      verificationEndTime,
      thumbnailUrl,
      exampleImages,
      maxParticipantCount,
      // isEvent, // 이벤트 챌린지 여부
      // leafReward, // 보상 개수
      // verificationImages, // 참여자 인증 사진
      // currentParticipantCount, // 참여자수
      // status, // 제출 여부
    } = challengeData.data

    const defaultValues: FullFormValues = {
      title,
      description,
      category: convertLanguage(CHALLENGE_CATEGORY_PAIRS, 'eng', 'kor')(category) as ChallengeCategoryTypeKor,
      maxParticipant: maxParticipantCount,
      thumbnailUrl,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: verificationStartTime,
      endTime: verificationEndTime,
      examples: exampleImages.map(image => ({
        id: image.id,
        url: image.imageUrl,
        description: image.description,
        type: image.type,
        // sequenceNumber: image.sequenceNumber,
      })),
    }

    contents = <GroupChallengeFormPage defaultValues={defaultValues} isEdit={true} challengeId={id} />
  }
  return contents
}
