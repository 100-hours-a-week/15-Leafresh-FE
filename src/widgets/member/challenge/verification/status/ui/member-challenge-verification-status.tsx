'use client'

import {
  PostGroupVerificationBody,
  PostGroupVerificationResponse,
} from '@entities/challenge/api/group/verification/create-group-verification'
import VerificationCarousel from '@features/challenge/components/challenge/participate/verification/VerificationCarousel'
import { useGroupVerificationResult } from '@features/challenge/hook/useGroupVerification'
import { useGroupVerifications } from '@features/challenge/hook/useGroupVerificationList'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'

import { MemberChallengeVerificationStatusPageProps } from '../model/types'
import * as S from './styles'
export const MemberChallengeVerificationStatusPage = ({
  participateId,
}: MemberChallengeVerificationStatusPageProps) => {
  const challengeId = Number(participateId)

  const { data, isLoading, error } = useGroupVerifications(challengeId)
  const postMutation = useMutationStore<
    PostGroupVerificationResponse,
    { challengeId: number; body: PostGroupVerificationBody }
  >(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.SUBMIT)
  const resultQuery = useGroupVerificationResult(challengeId)

  const { open: openCameraModal } = useCameraModalStore()

  if (isLoading) return <S.Message>Loading...</S.Message>
  if (error) return <S.Message>Error: {error.message}</S.Message>

  const { title, achievement, verifications, todayStatus } = data!.data

  const handleCapture = () => {
    openCameraModal(
      // 1. 제목
      `${title} 인증`,
      // 2. 완료 콜백: imageUrl → Blob → FormData → mutate
      async ({ imageUrl, description }) => {
        postMutation.mutate({
          challengeId,
          body: {
            imageUrl,
            content: description,
          },
        })
      },
      /* 3. hasDescription */ true,
      //   /* 4. type */ 'SUCCESS',
    )
  }
  return (
    <S.Container>
      <S.Title>{title} 챌린지</S.Title>
      <S.Stats>
        <S.Stat>
          <S.Label>인증 성공</S.Label>
          <S.Count>{achievement.success}회</S.Count>
        </S.Stat>
        <S.Stat>
          <S.Label>인증 실패</S.Label>
          <S.Count>{achievement.failure}회</S.Count>
        </S.Stat>
        <S.Stat>
          <S.Label>남은 인증</S.Label>
          <S.Count>{achievement.remaining}회</S.Count>
        </S.Stat>
      </S.Stats>
      <S.GridWrapper>
        {verifications.length !== 0 ? (
          <VerificationCarousel verifications={verifications} />
        ) : (
          <S.NoneContent>인증 목록이 없습니다.</S.NoneContent>
        )}
      </S.GridWrapper>

      <S.ButtonGroup>
        <S.QuestionButton>문의하기</S.QuestionButton>
        {todayStatus === 'NOT_SUBMITTED' && <S.ActionButton onClick={handleCapture}>인증하기</S.ActionButton>}

        {todayStatus === 'PENDING_APPROVAL' && <S.DisabledButton>인증 중</S.DisabledButton>}

        {todayStatus === 'DONE' && <S.DisabledButton>금일 참여 완료</S.DisabledButton>}
      </S.ButtonGroup>

      {resultQuery.data?.data.status === 'APPROVED' && <S.ResultMessage>인증이 승인되었습니다!</S.ResultMessage>}
      {resultQuery.data?.data.status === 'REJECTED' && <S.ResultMessage>인증이 거절되었습니다.</S.ResultMessage>}
    </S.Container>
  )
}
