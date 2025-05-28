'use client'

import { useState, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import Image from 'next/image'
import { theme } from '@shared/styles/theme'

import { treeLevelMap } from './ProfileBox'

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
            {/* 상단 프로필 영역 */}
            <TopSection>
              <ProfileImageWrapper>
                <Image src={data.profileImageUrl} alt='프로필 이미지' width={60} height={60} />
              </ProfileImageWrapper>
              <ProfileInfo>
                <Nickname>{data.nickname}</Nickname>
                <CompactStats>
                  <StatItem>
                    <StatLabel>인증 성공</StatLabel>
                    <StatValue>{data.totalSuccessfulVerifications}회</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>완료 챌린지</StatLabel>
                    <StatValue>{data.completedGroupChallengesCount}회</StatValue>
                  </StatItem>
                </CompactStats>
              </ProfileInfo>
            </TopSection>

            {/* 나뭇잎 진행 상황 */}
            <ProgressSection>
              <LeafValueWrapper>
                <LeafStatWrapper>
                  <ProgressTitle>누적 나뭇잎</ProgressTitle>
                  <LeavesStat>{data.totalLeafPoints}</LeavesStat>
                </LeafStatWrapper>
                <LeafIcon src='/icon/leaf.png' alt='leaf' width={20} height={20} />
                <LeafStatWrapper>
                  <ProgressTitle>남은 나뭇잎</ProgressTitle>
                  <LeavesStat>{data.leafPointsToNextLevel}</LeavesStat>
                </LeafStatWrapper>
              </LeafValueWrapper>

              <ProgressValues>
                <ProgressItem>
                  <TreeIcon>
                    <Image src={data.treeImageUrl} alt='현재 레벨' width={24} height={24} />
                  </TreeIcon>
                </ProgressItem>
                <ProgressItem>
                  <TreeIcon>
                    <Image src={data.nextTreeImageUrl} alt='다음 레벨' width={24} height={24} />
                  </TreeIcon>
                </ProgressItem>
              </ProgressValues>

              <ProgressBarSection>
                <CurrentLabel>{treeLevelMap[data.treeLevelId] ?? `${data.treeLevelId}`}</CurrentLabel>
                <ProgressBar>
                  <Progress
                    style={{
                      width: `${(data.totalLeafPoints / (data.totalLeafPoints + data.leafPointsToNextLevel)) * 100}%`,
                    }}
                  />
                </ProgressBar>
                <NextLabel>{treeLevelMap[data.treeLevelId + 1] ?? `${data.treeLevelId + 1}`}</NextLabel>
              </ProgressBarSection>
            </ProgressSection>

            {/* 뱃지 영역 */}
            <BadgeSection>
              {data.badges.length > 0 ? (
                <BadgeGrid>
                  {data.badges.map(badge => (
                    <BadgeItem key={badge.id}>
                      <BadgeImage>
                        <Image src={badge.imageUrl} alt={badge.name} width={60} height={60} />
                      </BadgeImage>
                      <BadgeName>{badge.name}</BadgeName>
                    </BadgeItem>
                  ))}
                </BadgeGrid>
              ) : (
                <NoBadgeMessage>획득한 뱃지가 아직 없어요!</NoBadgeMessage>
              )}
            </BadgeSection>
          </CardFace>
          <CardEdge />
          {/* 뒷면 */}
          <CardFace className='back'>
            <Image src='/image/main-icon.svg' alt='supy2' width={160} height={160} />
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

/* 상단 프로필 영역 */
const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 30px 0;
`

const ProfileImageWrapper = styled.div`
  border: 2px solid #ddd;
  border-radius: 50%;
  padding: 2px;
  flex-shrink: 0;
`

const ProfileInfo = styled.div`
  flex: 1;
`

const Nickname = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`

const CompactStats = styled.div`
  display: flex;
  gap: 16px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StatLabel = styled.span`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`

const StatValue = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`

/* 진행 상황 영역 */
const ProgressSection = styled.div`
  background: white;
  width: 95%;
  border-radius: 16px;
  padding: 30px 20px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const LeafValueWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`

const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const TreeIcon = styled.div`
  display: flex;
  align-items: center;
`

const LeafIcon = styled(Image)`
  width: 20px;
  height: 20px;

  object-fit: cover;
`
const ProgressTitle = styled.span`
  font-size: 14px;
  color: #666;
  text-align: center;
`

const ProgressValues = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`

const LeafStatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`

const LeavesStat = styled.span`
  font-size: 12px;
  font-weight: ${theme.fontWeight.bold};
  color: #4caf50;
`

const ProgressBarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CurrentLabel = styled.span`
  font-size: 12px;
  color: #666;
  min-width: 24px;
`

const ProgressBar = styled.div`
  flex: 1;
  height: 12px;
  background: #e8f5e8;
  border-radius: 6px;
  overflow: hidden;
`

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
  border-radius: 6px;
`

const NextLabel = styled.span`
  font-size: 12px;
  color: #666;
  min-width: 24px;
  text-align: right;
`

/* 뱃지 영역 */
const BadgeSection = styled.div`
  flex: 1;
  margin-top: 20px;
`

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  justify-items: center;
`

const BadgeItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const BadgeImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const BadgeName = styled.span`
  font-size: 10px;
  color: #666;
  text-align: center;
  line-height: 1.2;
`

const NoBadgeMessage = styled.p`
  font-size: ${theme.fontSize.sm};
  color: #888;
  text-align: center;
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

const Badges = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
`
