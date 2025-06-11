'use client'

import { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChallengeGroupFormPage, FullFormValues } from '@widgets/challenge'

import { CHALLENGE_CATEGORY_PAIRS, convertLanguage } from '@entities/challenge/constant'
import { ChallengeCategoryTypeKor } from '@entities/challenge/type'
import { getGroupChallengeDetails } from '@features/challenge/api/get-group-challenge-details'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'

import { ChallengeGroupModifyPageProps } from '../model/type'

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
      // 불필요 데이터
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

    contents = <ChallengeGroupFormPage defaultValues={defaultValues} isEdit={true} challengeId={id} />
  }
  return contents
}
