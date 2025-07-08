'use client'

import { useQuery } from '@tanstack/react-query'

import { VerificationCarousel } from '@/features/challenge/components'

import {
  getGroupVerifications,
  PostGroupVerificationBody,
  PostGroupVerificationResponse,
} from '@/entities/challenge/api'

import { Loading } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { useCameraModalStore, usePollingStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'

import * as S from './styles'

export function GroupVerificationPage({ challengeId }: { challengeId: number }) {
  const { toast } = useToast()

  const { open: openCameraModal } = useCameraModalStore()
  const { addGroupChallengeId } = usePollingStore()

  const {
    data: verificationData,
    isPending,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS(challengeId),
    queryFn: () => getGroupVerifications(challengeId),
    ...QUERY_OPTIONS.MEMBER.CHALLENGE.GROUP.VERIFICATIONS,
  })

  //mutation 사진 인증 요청
  const { mutate: VerifyMutate } = useMutationStore<
    PostGroupVerificationResponse,
    { challengeId: number; body: PostGroupVerificationBody }
  >(MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.SUBMIT)

  if (isPending) return <Loading />
  if (error) return <S.Message>Error: {error.message}</S.Message>

  const verifications = verificationData!.data

  const handleCapture = () => {
    openCameraModal(
      // 1. 제목
      `${verifications.title} 인증`,
      // 2. 완료 콜백: imageUrl → Blob → FormData → mutate
      async ({ imageUrl, description }) => {
        VerifyMutate(
          {
            challengeId,
            body: {
              imageUrl,
              content: description,
            },
          },
          {
            onSuccess: () => {
              addGroupChallengeId(challengeId) // 인증 결과 롱폴링 시작
              toast('Success', `인증 제출 성공!\nAI 판독 결과를 기다려주세요`) // 성공 메시지
            },
          },
        )
      },
      // #3. 이미지에 대한 설명을 받을지 여부
      true,

      // #4. 어떤 인증인지 여부
      'DONE' /** TODO: SUCCESS / FAILURE가 아닌걸로 설정하기 위해 더미값 넣어둠, 구별 필요 */,

      // #5. 챌린지 정보 명시
      {
        id: challengeId,
        type: 'GROUP',
      },
    )
  }

  return (
    <S.Container>
      <S.Title>{verifications.title} 챌린지</S.Title>
      <S.Stats>
        <S.Stat>
          <S.Label>인증 성공</S.Label>
          <S.Count>{verifications.achievement.success}회</S.Count>
        </S.Stat>
        <S.Stat>
          <S.Label>인증 실패</S.Label>
          <S.Count>{verifications.achievement.failure}회</S.Count>
        </S.Stat>
        <S.Stat>
          <S.Label>남은 인증</S.Label>
          <S.Count>{verifications.achievement.remaining}회</S.Count>
        </S.Stat>
      </S.Stats>
      <S.GridWrapper>
        {verifications.verifications.length !== 0 ? (
          <VerificationCarousel verifications={verifications.verifications} />
        ) : (
          <S.NoneContent>인증 목록이 없습니다.</S.NoneContent>
        )}
      </S.GridWrapper>

      <S.ButtonGroup>
        {/* <QuestionButton>문의하기</QuestionButton> */}
        {verifications.todayStatus === 'NOT_SUBMITTED' && (
          <S.ActionButton onClick={handleCapture}>인증하기</S.ActionButton>
        )}
        {verifications.todayStatus === 'PENDING_APPROVAL' && <S.DisabledButton>인증 중</S.DisabledButton>}
        {verifications.todayStatus === 'DONE' && <S.DisabledButton>금일 참여 완료</S.DisabledButton>}
      </S.ButtonGroup>
    </S.Container>
  )
}
