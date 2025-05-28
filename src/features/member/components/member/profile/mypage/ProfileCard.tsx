'use client'

import { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import Image from 'next/image'

interface Badge {
  id: number
  name: string
  imageUrl: string
}

interface ProfileCardData {
  nickname: string
  profileImageUrl: string
  treeLevelId: number
  treeLevelName: string
  treeImageUrl: string
  nextTreeLevelName: string
  nextTreeImageUrl: string
  totalLeafPoints: number
  leafPointsToNextLevel: number
  totalSuccessfulVerifications: number
  completedGroupChallengesCount: number
  badges: Badge[]
}

interface ProfileCardProps {
  data: ProfileCardData
  onDismiss?: () => void
}

const DRAG_THRESHOLD = 50

const ProfileCard = ({ data, onDismiss }: ProfileCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const lastX = useRef(0)

  const rotation = useRef(0)
  const offsetY = useRef(0)

  const animationFrame = useRef<number | null>(null)
  const dragging = useRef(false)

  const [isVisible, setIsVisible] = useState(true)
  const [displayRotation, setDisplayRotation] = useState(0)
  const [displayOffsetY, setDisplayOffsetY] = useState(0)

  const onStart = (x: number, y: number) => {
    startX.current = x
    startY.current = y
    lastX.current = x
    dragging.current = true

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onEnd)

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
    }
  }

  const onMove = (x: number, y: number) => {
    if (!dragging.current) return

    const dx = x - lastX.current
    const dy = y - startY.current

    rotation.current += dx * 0.4
    offsetY.current = dy > 0 ? dy : 0

    setDisplayRotation(rotation.current % 360) // ✅ 360도 회전 지원
    setDisplayOffsetY(offsetY.current)

    lastX.current = x
  }

  const onEnd = () => {
    dragging.current = false

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onEnd)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onEnd)

    if (offsetY.current > DRAG_THRESHOLD) {
      setDisplayOffsetY(100)
      setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, 200)
      return
    }

    // ✅ 가장 가까운 180도 단위로 보정
    const targetRotation = Math.round(rotation.current / 180) * 180

    const animate = () => {
      rotation.current += (targetRotation - rotation.current) * 0.4
      if (Math.abs(rotation.current - targetRotation) < 1) {
        rotation.current = targetRotation
        setDisplayRotation(rotation.current % 360)
        return
      }
      setDisplayRotation(rotation.current % 360)
      animationFrame.current = requestAnimationFrame(animate)
    }

    animate()
    offsetY.current = 0
    setDisplayOffsetY(0)
  }

  const onMouseDown = (e: React.MouseEvent) => {
    onStart(e.clientX, e.clientY)
  }

  const onMouseMove = (e: MouseEvent) => {
    onMove(e.clientX, e.clientY)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    onStart(touch.clientX, touch.clientY)
  }

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0]
    onMove(touch.clientX, touch.clientY)
  }

  return (
    <Wrapper visible={isVisible} hidden={!isVisible}>
      <CardContainer
        ref={cardRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          transform: `translateY(${displayOffsetY}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <Card style={{ transform: `rotateY(${displayRotation}deg)` }}>
          {/* 앞면 */}
          <CardFace className='front'>
            <ProfileImageWrapper>
              <Image src={data.profileImageUrl} alt='프로필 이미지' width={80} height={80} />
            </ProfileImageWrapper>
            <Nickname>{data.nickname}</Nickname>
            <Stats>
              <span>인증 성공</span>
              <strong>{data.totalSuccessfulVerifications}회</strong>
              <span>완료 챌린지</span>
              <strong>{data.completedGroupChallengesCount}회</strong>
            </Stats>
            <ProgressBox>
              <LevelImages>
                <Image src={data.treeImageUrl} alt='현재 레벨' width={40} height={40} />
                <Image src={data.nextTreeImageUrl} alt='다음 레벨' width={40} height={40} />
              </LevelImages>
              <ProgressText>
                누적 나뭇잎 {data.totalLeafPoints} / 남은 {data.leafPointsToNextLevel}
              </ProgressText>
              <ProgressBar>
                <Progress
                  style={{
                    width: `${(data.totalLeafPoints / (data.totalLeafPoints + data.leafPointsToNextLevel)) * 100}%`,
                  }}
                />
              </ProgressBar>
            </ProgressBox>
            <Badges>
              {data.badges.length > 0 ? (
                data.badges.map(badge => (
                  <BadgeItem key={badge.id}>
                    <Image src={badge.imageUrl} alt={badge.name} width={50} height={50} />
                    <span>{badge.name}</span>
                  </BadgeItem>
                ))
              ) : (
                <NoBadgeMessage>획득한 뱃지가 아직 없어요!</NoBadgeMessage>
              )}
            </Badges>
          </CardFace>
          <CardEdge />
          {/* 뒷면 */}
          <CardFace className='back'>
            <Image src='/image/chatbot.png' alt='supy' width={160} height={160} />
          </CardFace>
        </Card>
      </CardContainer>
    </Wrapper>
  )
}

export default ProfileCard

const Wrapper = styled.div<{ visible: boolean; hidden: boolean }>`
  z-index: ${({ hidden }) => (hidden ? -1 : 9999)};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;

  user-select: none;
  -webkit-user-drag: none;
  cursor: grab;
`

const CardContainer = styled.div`
  width: 320px;
  height: 480px;
  transition:
    transform 0.3s ease,
    opacity 0.4s ease;
  pointer-events: auto;
`

const Card = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: grab;
  transform-origin: center center;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  border-radius: 20px;
  transition: transform 0.8s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  user-select: none;
  -webkit-user-drag: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: #eff8ee;
    z-index: -1;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #eff8ee;
  border-radius: 20px;
  padding: 20px;

  &.back {
    transform: rotateY(180deg);
    cursor: grab;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
`
const CardEdge = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  width: 10px;
  height: 100%;
  background: linear-gradient(to bottom, #e3f4de, #d0e8cb);
  transform-origin: left;
  transform: rotateY(90deg);
  border-radius: 0 10px 10px 0;
  backface-visibility: hidden;
`

const ProfileImageWrapper = styled.div`
  border: 2px solid #ccc;
  border-radius: 50%;
  padding: 4px;
  margin-bottom: 12px;
`

const Nickname = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`

const Stats = styled.div`
  font-size: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  text-align: center;
  margin-bottom: 16px;
`

const ProgressBox = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`

const LevelImages = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`

const ProgressText = styled.p`
  font-size: 13px;
  text-align: center;
  margin-bottom: 4px;
`

const ProgressBar = styled.div`
  height: 10px;
  background: #d1eacd;
  border-radius: 5px;
  overflow: hidden;
`

const Progress = styled.div`
  height: 100%;
  background: #73b572;
  transition: width 0.3s ease;
`

const Badges = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
`

const BadgeItem = styled.div`
  text-align: center;
  font-size: 12px;
`

const NoBadgeMessage = styled.p`
  font-size: 13px;
  color: #888;
  text-align: center;
`
