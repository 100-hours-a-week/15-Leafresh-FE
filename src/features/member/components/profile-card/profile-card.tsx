'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import styled from '@emotion/styled'

import { treeLevelMap } from '@/entities/member/model'

import { theme } from '@/shared/config'
import { useScrollLock } from '@/shared/hooks'

import { GuideOverlay } from '../guide-overlay'

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

export const ProfileCard = ({ data, onDismiss }: ProfileCardProps) => {
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

  const [guideVisible, setGuideVisible] = useState(true)

  // 카드 등장 후 자동 제거 타이머
  useEffect(() => {
    const timer = setTimeout(() => setGuideVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const onStart = (x: number, y: number) => {
    setGuideVisible(false)
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

  useScrollLock(isVisible)

  return (
    <Wrapper visible={isVisible} hidden={!isVisible}>
      <GuideOverlay visible={guideVisible} />
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
                <ProfileImg src={data.profileImageUrl} alt='프로필 이미지' width={60} height={60} />
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
                <ProgressTitle>누적 나뭇잎</ProgressTitle>
                <LeafStatWrapper>
                  <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} />
                  <SumLeavesStat>{data.totalLeafPoints}</SumLeavesStat>
                </LeafStatWrapper>
                <ProgressTitle>다음 단계까지</ProgressTitle>
                <LeafStatWrapper>
                  <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} />
                  <RemainLeavesStat>{data.leafPointsToNextLevel}</RemainLeavesStat>
                </LeafStatWrapper>
              </LeafValueWrapper>

              <ProgressBarSection>
                <ProgressBar>
                  <Progress
                    style={{
                      width: `${(data.totalLeafPoints / (data.totalLeafPoints + data.leafPointsToNextLevel)) * 100}%`,
                    }}
                  />
                </ProgressBar>

                <LeftTreeLabel>
                  <Image src={data.treeImageUrl} alt='현재 레벨' width={30} height={30} />
                  <span>{treeLevelMap[data.treeLevelId] ?? `${data.treeLevelId}`}</span>
                </LeftTreeLabel>

                <RightTreeLabel>
                  <Image src={data.nextTreeImageUrl} alt='다음 레벨' width={30} height={30} />
                  <span>{treeLevelMap[data.treeLevelId + 2] ?? `${data.treeLevelId + 2}`}</span>
                </RightTreeLabel>
              </ProgressBarSection>
            </ProgressSection>

            {/* 뱃지 영역 */}
            <BadgeSection>
              {data.badges.length > 0 ? (
                <BadgeGrid>
                  {data.badges.map(badge => (
                    <BadgeItem key={badge.id}>
                      <BadgeImage>
                        <Image src={badge.imageUrl} alt={badge.name} fill style={{ objectFit: 'cover' }} />
                      </BadgeImage>
                      <BadgeName>{badge.name}</BadgeName>
                    </BadgeItem>
                  ))}
                </BadgeGrid>
              ) : (
                <NoBadgeMessage>아직 획득한 뱃지가 없어요!</NoBadgeMessage>
              )}
            </BadgeSection>
          </CardFace>
          {/* 뒷면 */}
          <CardFace className='back'>
            <Image src='/image/main-icon.svg' alt='supy2' width={160} height={160} />
          </CardFace>
        </Card>
      </CardContainer>
    </Wrapper>
  )
}

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

/* 상단 프로필 영역 */
const TopSection = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 30px;
  padding: 15px 0;
`

const ProfileImageWrapper = styled.div`
  border-radius: ${theme.radius.full};
  /* overflow: hidden; */
  width: 60px;
  height: 60px;
  padding: 2px;
  flex-shrink: 0;
`

const ProfileImg = styled(Image)`
  object-fit: cover;
  border-radius: ${theme.radius.full};
  width: 60px;
  height: 60px;
`

const ProfileInfo = styled.div`
  flex: 1;
`

const Nickname = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
  margin-bottom: 10px;
`

const CompactStats = styled.div`
  display: flex;
  gap: 20px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`

const StatLabel = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfDarkGray.base};
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
  border-radius: ${theme.radius.lg};
  padding: 30px 20px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const LeafValueWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center;

  gap: 8px;
`
const LeafIcon = styled(Image)`
  width: 24px;
  height: 24px;

  object-fit: cover;
`
const ProgressTitle = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
  text-align: center;

  display: flex;
  align-items: center;

  margin-right: 6px;
`

const LeafStatWrapper = styled.div`
  display: flex;

  color: ${theme.colors.lfBlack.base};
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
`

const SumLeavesStat = styled.span`
  color: #4caf50;
`
const RemainLeavesStat = styled.span`
  color: ${theme.colors.lfBlack.base};
`

const ProgressBarSection = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap: 20px;
  /* gap: 12px; */
  align-items: center;
`
const TreeLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
  font-weight: ${theme.fontWeight.medium};
  gap: 4px;
`

const LeftTreeLabel = styled(TreeLabel)`
  justify-self: start;
`

const RightTreeLabel = styled(TreeLabel)`
  justify-self: end;
`

const ProgressBar = styled.div`
  grid-column: 1 / 3;
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
  padding: 0 3px;
  font-size: 12px;
  color: #666;
  min-width: 24px;
  text-align: right;
`

/* 뱃지 영역 */
const BadgeSection = styled.div`
  width: 95%;
  flex: 1;
  margin-bottom: 20px;
`

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  justify-items: center;
`

const BadgeItem = styled.div`
  width: 100%;

  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const BadgeImage = styled.div`
  width: 100%;
  aspect-ratio: 1/1;

  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  position: relative;
`

const BadgeName = styled.span`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
  text-align: center;
`

const NoBadgeMessage = styled.p`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
  text-align: center;
`

const Badges = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
`
