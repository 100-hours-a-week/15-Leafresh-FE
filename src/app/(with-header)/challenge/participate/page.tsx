'use client'
import React, { useEffect, useState } from 'react'
import ChallengeCard from '@features/challenge/components/challenge/participate/GroupChallengeParticipantCard'
import styled from '@emotion/styled'

interface ChallengeResponse {
  status: number
  message: string
  data: {
    challenges: {
      id: number
      title: string
      thumbnailUrl: string
      startDate: string
      endDate: string
      achievement: {
        success: number
        total: number
      }
    }[]
    hasNext: boolean
    cursorInfo: {
      lastCursorId: number
      cursorTimestamp: string
    }
  }
}

const ChallengeParticipatePage = () => {
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock API call - in real app, replace with actual fetch call
    const fetchChallenges = async () => {
      try {
        // In a real app, this would be a fetch call:
        // const response = await fetch('/api/challenges')
        // const data = await response.json()

        // Mock data based on your example
        const mockResponse: ChallengeResponse = {
          status: 200,
          message: '참여한 단체 챌린지 목록을 성공적으로 조회했습니다.',
          data: {
            challenges: [
              {
                id: 0,
                title: '텀블러 챌린지',
                thumbnailUrl: '/image/chatbot.png',
                startDate: '2025-01-01',
                endDate: '2025-02-01',
                achievement: {
                  success: 1,
                  total: 5,
                },
              },
              {
                id: 12,
                title: '채식 챌린지',
                thumbnailUrl: '/image/chatbot.png',
                startDate: '2025-03-01',
                endDate: '2025-03-10',
                achievement: {
                  success: 4,
                  total: 7,
                },
              },
            ],
            hasNext: false,
            cursorInfo: {
              lastCursorId: 42,
              cursorTimestamp: '2025-05-01T10:00:00',
            },
          },
        }

        setChallenges(mockResponse.data.challenges)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch challenges:', error)
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  const handleCardClick = (id: number) => {
    console.log(`Clicked on challenge ${id}`)
    // Navigate to detail page or show modal, etc.
  }

  if (loading) {
    return <div>Loading challenges...</div>
  }

  return (
    <Container>
      <Title>참여 중인 챌린지 스위치 탭 위치치</Title>
      <ChallengeList>
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            title={challenge.title}
            imageUrl={challenge.thumbnailUrl}
            startDate={new Date(challenge.startDate)}
            endDate={new Date(challenge.endDate)}
            successCount={challenge.achievement.success}
            maxCount={challenge.achievement.total}
            onClick={() => handleCardClick(challenge.id)}
          />
        ))}
      </ChallengeList>
    </Container>
  )
}

export default ChallengeParticipatePage

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`

const ChallengeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
