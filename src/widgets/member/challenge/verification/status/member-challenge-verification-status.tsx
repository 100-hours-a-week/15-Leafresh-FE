'use client'

import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { VerificationCarousel } from '@/features/challenge/components'

import {
  getGroupVerifications,
  PostGroupVerificationBody,
  PostGroupVerificationResponse,
} from '@/entities/challenge/api'

import { Loading } from '@/shared/components'
import { theme } from '@/shared/config'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { ToastType, useCameraModalStore, usePollingStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { responsiveHorizontalPadding } from '@/shared/styles'

export function GroupVerificationPage({ participateId }: { participateId: number }) {
  const openToast = useToast()

  const { open: openCameraModal } = useCameraModalStore()
  const { addGroupChallengeId } = usePollingStore()

  const challengeId = participateId

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
  if (error) return <Message>Error: {error.message}</Message>

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
              openToast(ToastType.Success, `인증 제출 성공!\nAI 판독 결과를 기다려주세요`) // 성공 메시지
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
    <Container>
      <Title>{verifications.title} 챌린지</Title>
      <Stats>
        <Stat>
          <Label>인증 성공</Label>
          <Count>{verifications.achievement.success}회</Count>
        </Stat>
        <Stat>
          <Label>인증 실패</Label>
          <Count>{verifications.achievement.failure}회</Count>
        </Stat>
        <Stat>
          <Label>남은 인증</Label>
          <Count>{verifications.achievement.remaining}회</Count>
        </Stat>
      </Stats>
      <GridWrapper>
        {verifications.verifications.length !== 0 ? (
          <VerificationCarousel verifications={verifications.verifications} />
        ) : (
          <NoneContent>인증 목록이 없습니다.</NoneContent>
        )}
      </GridWrapper>

      <ButtonGroup>
        {/* <QuestionButton>문의하기</QuestionButton> */}
        {verifications.todayStatus === 'NOT_SUBMITTED' && <ActionButton onClick={handleCapture}>인증하기</ActionButton>}
        {verifications.todayStatus === 'PENDING_APPROVAL' && <DisabledButton>인증 중</DisabledButton>}
        {verifications.todayStatus === 'DONE' && <DisabledButton>금일 참여 완료</DisabledButton>}
      </ButtonGroup>
    </Container>
  )
}

const Container = styled.div`
  ${responsiveHorizontalPadding};

  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const Title = styled.h2`
  align-self: center;
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`
const Stats = styled.div`
  display: flex;
  justify-content: space-between;
`
const Stat = styled.div`
  text-align: center;
`
const Label = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfDarkGray.base};
`
const Count = styled.div`
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.bold};
  margin-top: 4px;
`
const GridWrapper = styled.div`
  width: 100%;

  position: relative;
  gap: 16px;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const QuestionButton = styled.button`
  text-align: center;
  padding: 12px;
  background: ${theme.colors.lfGreenInactive.base};
  color: ${theme.colors.lfWhite.base};
  border: none;
  border-radius: 4px;
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.regular};
  /* cursor: pointer; */
  cursor: default;
`
const ActionButton = styled.button`
  padding: 12px;
  background: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border: none;
  border-radius: 4px;
  font-size: ${theme.fontSize.md};
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
const DisabledButton = styled.button`
  padding: 12px;
  background: ${theme.colors.lfGreenInactive.base};
  color: ${theme.colors.lfWhite.base};
  border: none;
  border-radius: 4px;
  font-size: ${theme.fontSize.md};
  cursor: default;
`
const Message = styled.div`
  padding: 40px;
  text-align: center;
`

const NoneContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
