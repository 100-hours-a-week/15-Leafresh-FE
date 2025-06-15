'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { treeLevelMap } from '@entities/member/constant'
import { useScrollLock } from '@shared/hooks/use-scroll-lock/useScrollLock'

import { GuideOverlay } from '../../guide-overlay'
import { DRAG_THRESHOLD } from '../model/consts'
import { ProfileCardProps } from '../model/types'
import * as S from './styles'

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
    <S.Wrapper visible={isVisible} hidden={!isVisible}>
      <GuideOverlay visible={guideVisible} />
      <S.CardContainer
        ref={cardRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        style={{
          transform: `translateY(${displayOffsetY}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <S.Card style={{ transform: `rotateY(${displayRotation}deg)` }}>
          {/* 앞면 */}
          <S.CardFace className='front'>
            {/* 상단 프로필 영역 */}
            <S.TopSection>
              <S.ProfileImageWrapper>
                <S.ProfileImg src={data.profileImageUrl} alt='프로필 이미지' width={60} height={60} />
              </S.ProfileImageWrapper>
              <S.ProfileInfo>
                <S.Nickname>{data.nickname}</S.Nickname>
                <S.CompactStats>
                  <S.StatItem>
                    <S.StatLabel>인증 성공</S.StatLabel>
                    <S.StatValue>{data.totalSuccessfulVerifications}회</S.StatValue>
                  </S.StatItem>
                  <S.StatItem>
                    <S.StatLabel>완료 챌린지</S.StatLabel>
                    <S.StatValue>{data.completedGroupChallengesCount}회</S.StatValue>
                  </S.StatItem>
                </S.CompactStats>
              </S.ProfileInfo>
            </S.TopSection>

            {/* 나뭇잎 진행 상황 */}
            <S.ProgressSection>
              <S.LeafValueWrapper>
                <S.ProgressTitle>누적 나뭇잎</S.ProgressTitle>
                <S.LeafStatWrapper>
                  <S.LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} />
                  <S.SumLeavesStat>{data.totalLeafPoints}</S.SumLeavesStat>
                </S.LeafStatWrapper>
                <S.ProgressTitle>다음 단계까지</S.ProgressTitle>
                <S.LeafStatWrapper>
                  <S.LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} />
                  <S.RemainLeavesStat>{data.leafPointsToNextLevel}</S.RemainLeavesStat>
                </S.LeafStatWrapper>
              </S.LeafValueWrapper>

              <S.ProgressBarSection>
                <S.ProgressBar>
                  <S.Progress
                    style={{
                      width: `${(data.totalLeafPoints / (data.totalLeafPoints + data.leafPointsToNextLevel)) * 100}%`,
                    }}
                  />
                </S.ProgressBar>

                <S.LeftTreeLabel>
                  <Image src={data.treeImageUrl} alt='현재 레벨' width={30} height={30} />
                  <span>{treeLevelMap[data.treeLevelId] ?? `${data.treeLevelId}`}</span>
                </S.LeftTreeLabel>

                <S.RightTreeLabel>
                  <Image src={data.nextTreeImageUrl} alt='다음 레벨' width={30} height={30} />
                  <span>{treeLevelMap[data.treeLevelId + 2] ?? `${data.treeLevelId + 2}`}</span>
                </S.RightTreeLabel>
              </S.ProgressBarSection>
            </S.ProgressSection>

            {/* 뱃지 영역 */}
            <S.BadgeSection>
              {data.badges.length > 0 ? (
                <S.BadgeGrid>
                  {data.badges.map(badge => (
                    <S.BadgeItem key={badge.id}>
                      <S.BadgeImage>
                        <Image
                          src={badge.imageUrl}
                          alt={badge.name}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </S.BadgeImage>
                      <S.BadgeName>{badge.name}</S.BadgeName>
                    </S.BadgeItem>
                  ))}
                </S.BadgeGrid>
              ) : (
                <S.NoBadgeMessage>아직 획득한 뱃지가 없어요!</S.NoBadgeMessage>
              )}
            </S.BadgeSection>
          </S.CardFace>
          {/* 뒷면 */}
          <S.CardFace className='back'>
            <Image src='/image/main-icon.svg' alt='supy2' width={160} height={160} />
          </S.CardFace>
        </S.Card>
      </S.CardContainer>
    </S.Wrapper>
  )
}
