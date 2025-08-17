'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import useEmblaCarousel from 'embla-carousel-react'

import { TimeDealProduct } from '@/entities/store/api'

import { LucideIcon } from '@/shared/components'
import { URL } from '@/shared/constants'
import { useConfirmModalStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'

import { OngoingTimeDealCard } from '../ongoing-timedeal-card'

import * as S from './styles'

interface Props {
  ongoingData: TimeDealProduct[]
  upcomingData: TimeDealProduct[]
  memberLeafCount?: number // 보유 나뭇잎 수
  className?: string
}

export const OngoingTimeDealList = ({ ongoingData, upcomingData, memberLeafCount, className }: Props): ReactNode => {
  const router = useRouter()
  const { isLoggedIn } = useUserStore()
  const { toast } = useToast()
  const { openConfirmModal } = useConfirmModalStore()

  // ✅ 토스트 중복 방지 ref
  const loginToastShownRef = useRef(false)
  const startToastShownRef = useRef(false)
  useEffect(() => {
    if (ongoingData.length > 0 || upcomingData.length === 0) return

    const interval = setInterval(() => {
      const now = Date.now()
      const nextStartTime = new Date(upcomingData[0].dealStartTime).getTime()
      const diff = Math.floor((nextStartTime - now) / 1000) // 초 단위 차이

      // 타임딜 시작 10초 전
      if (!startToastShownRef.current && diff > 0 && diff <= 10) {
        toast('Success', '다음 타임딜이 곧 시작됩니다!')
        startToastShownRef.current = true
      }

      // 타임딜 시작 60초 전 & 미로그인
      if (!loginToastShownRef.current && !isLoggedIn && diff <= 60 && diff > 5) {
        openConfirmModal({
          title: '타임딜이 곧 시작됩니다!',
          description: '로그인 페이지로 이동하시겠습니까?',
          onConfirm: () => router.push(URL.MEMBER.LOGIN.value()),
        })
        loginToastShownRef.current = true
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [ongoingData, upcomingData, isLoggedIn, toast])

  /** 각 재고의 남은 시간 트래킹 */
  const [remainingTimes, setRemainingTimes] = useState<number[]>([]) // "초" 단위
  useEffect(() => {
    const updateTimes = () => {
      const now = Date.now()
      const updated = ongoingData.map(deal => {
        const end = new Date(deal.dealEndTime).getTime()
        const diffInSec = Math.max(0, Math.floor((end - now) / 1000)) // 초 단위
        return diffInSec
      })
      setRemainingTimes(updated)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [ongoingData])

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false)
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false)
  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi])

  let timeDealContents
  /** 예외: 타임딜 상품이 없는 경우 */
  if (!ongoingData || ongoingData.length === 0) {
    timeDealContents = (
      <S.StyledApologizeFeedback
        title='진행 중인 특가 상품이 없습니다'
        description={`빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다\n감사합니다`}
      />
    )
  } else {
    /** 타임딜 상품이 있는 경우 */
    timeDealContents = (
      <S.CarouselWrapper>
        {canScrollPrev && (
          <S.LeftButton onClick={() => emblaApi?.scrollPrev()}>
            <LucideIcon name='ChevronLeft' size={24} />
          </S.LeftButton>
        )}

        <S.Embla ref={emblaRef}>
          <S.EmblaTrack>
            {ongoingData.map((deal, index) => (
              <OngoingTimeDealCard
                key={deal.productId}
                data={deal}
                remainingSec={remainingTimes[index] ?? 0}
                memberLeafCount={memberLeafCount}
              />
            ))}
          </S.EmblaTrack>
        </S.Embla>

        {canScrollNext && (
          <S.RightButton onClick={() => emblaApi?.scrollNext()}>
            <LucideIcon name='ChevronRight' size={24} />
          </S.RightButton>
        )}
      </S.CarouselWrapper>
    )
  }
  return (
    <S.Container className={className}>
      <S.TitleBox>
        <S.SectionTitle>🔥 지금만 이 가격</S.SectionTitle>
        <S.SubText>세상은 1등만 기억해!</S.SubText>
        {memberLeafCount !== undefined && <S.StyledLeafReward reward={memberLeafCount} />}
      </S.TitleBox>
      {timeDealContents}
    </S.Container>
  )
}
