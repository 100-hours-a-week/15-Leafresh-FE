'use client'

import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import VerificationCarousel from '@features/challenge/components/challenge/participate/verification/VerificationCarousel'
import { useGroupVerificationResult, usePostGroupVerification } from '@features/challenge/hook/useGroupVerification'
import { useGroupVerifications } from '@features/challenge/hook/useGroupVerificationList'
import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'

export default function GroupVerificationPage({ participateId }: { participateId: string }) {
  const challengeId = Number(participateId)
  const { data, isLoading, error } = useGroupVerifications(challengeId)
  const postMutation = usePostGroupVerification(challengeId)
  const resultQuery = useGroupVerificationResult(challengeId)

  const router = useRouter()

  const { open: openCameraModal } = useCameraModalStore()

  if (isLoading) return <Message>Loading...</Message>
  if (error) return <Message>Error: {error.message}</Message>

  const { title, achievement, verifications, todayStatus } = data!.data

  const handleCapture = () => {
    openCameraModal(
      // 1. 제목
      `${title} 인증`,
      // 2. 완료 콜백: imageUrl → Blob → FormData → mutate
      async ({ imageUrl, description }) => {
        postMutation.mutate({
          imageUrl: imageUrl,
          content: description,
        })
      },
      /* 3. hasDescription */ true,
      //   /* 4. type */ 'SUCCESS',
    )
  }
  return (
    <Container>
      <Title>{title} 챌린지</Title>
      <Stats>
        <Stat>
          <Label>인증 성공</Label>
          <Count>{achievement.success}회</Count>
        </Stat>
        <Stat>
          <Label>인증 실패</Label>
          <Count>{achievement.failure}회</Count>
        </Stat>
        <Stat>
          <Label>남은 인증</Label>
          <Count>{achievement.remaining}회</Count>
        </Stat>
      </Stats>
      <GridWrapper>
        {verifications.length !== 0 ? (
          <VerificationCarousel verifications={verifications} />
        ) : (
          <NoneContent>인증 목록이 없습니다.</NoneContent>
        )}
      </GridWrapper>

      <ButtonGroup>
        <QuestionButton>문의하기</QuestionButton>
        {todayStatus === 'NOT_SUBMITTED' && <ActionButton onClick={handleCapture}>인증하기</ActionButton>}

        {todayStatus === 'PENDING_APPROVAL' && <DisabledButton>인증 중</DisabledButton>}

        {todayStatus === 'DONE' && <DisabledButton>금일 참여 완료</DisabledButton>}
      </ButtonGroup>

      {resultQuery.data?.data.status === 'APPROVED' && <ResultMessage>인증이 승인되었습니다!</ResultMessage>}
      {resultQuery.data?.data.status === 'REJECTED' && <ResultMessage>인증이 거절되었습니다.</ResultMessage>}
    </Container>
  )
}

const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const Title = styled.h2`
  align-self: center;
  font-size: 1.25rem;
  font-weight: bold;
`
const Stats = styled.div`
  display: flex;
  justify-content: space-between;
`
const Stat = styled.div`
  text-align: center;
`
const Label = styled.div`
  font-size: 0.875rem;
  color: #555;
`
const Count = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 4px;
`
const GridWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  grid-template-columns: repeat(2, 1fr);
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
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
`
const ActionButton = styled.button`
  padding: 12px;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
const DisabledButton = styled.button`
  padding: 12px;
  background: #ccc;
  color: #666;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: default;
`
const Message = styled.div`
  padding: 40px;
  text-align: center;
`
const PollingMessage = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #555;
`
const ResultMessage = styled.div`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
`

const NoneContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
