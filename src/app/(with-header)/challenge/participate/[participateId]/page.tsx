'use client'

import React from 'react'
import styled from '@emotion/styled'
import { useGroupVerifications } from '@features/challenge/hook/useGroupVerificationList'
import VerificationImageCard from '@features/challenge/components/challenge/participate/verification/VerificationCard'
import { usePostGroupVerification, useGroupVerificationResult } from '@features/challenge/hook/useGroupVerification'

import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'
// const challeneId = Number(params.participateId)

export default function GroupVerificationPage({ params }: { params: { participateId: string } }) {
  const challengeId = Number(params.participateId)
  const { data, isLoading, error } = useGroupVerifications(challengeId)
  const postMutation = usePostGroupVerification(challengeId)
  const resultQuery = useGroupVerificationResult(challengeId)

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
        // const blob = await (await fetch(imageUrl)).blob()
        // const formData = new FormData()
        // formData.append('file', blob, 'photo.jpg')
        // if (description) {
        //   formData.append('description', description)
        // }
        postMutation.mutate({
          imageUrl:
            'https://storage.googleapis.com/leafresh-images/1746943991927-7f36141d-cd0e-47f3-a49f-9b6f42b1e8ab-_기능 설명서.png',
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
      {verifications.length !== 0 ? (
        <CardList>
          {verifications.map(v => (
            <VerificationImageCard key={v.day} day={v.day} imageUrl={v.imageUrl} status={v.status} />
          ))}
        </CardList>
      ) : (
        <NoneContent>인증 목록이 없습니다.</NoneContent>
      )}

      <ButtonGroup>
        <QuestionButton onClick={() => console.log('문의하기')}>문의하기</QuestionButton>
        {todayStatus === 'NOT_SUBMITTED' && <ActionButton onClick={handleCapture}>인증하기</ActionButton>}

        {todayStatus === 'PENDING_APPROVAL' && <DisabledButton>인증 중…</DisabledButton>}

        {todayStatus === 'DONE' && <DisabledButton>금일 참여 완료</DisabledButton>}
      </ButtonGroup>

      {resultQuery.isFetching && <PollingMessage>검토 중…</PollingMessage>}
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
const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`
const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const QuestionButton = styled.div`
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
