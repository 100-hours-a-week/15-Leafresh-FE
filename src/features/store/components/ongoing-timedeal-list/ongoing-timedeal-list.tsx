'use client'

import { ReactNode, useEffect, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'

import { TimeDealProduct } from '@/entities/store/api'

import { LucideIcon } from '@/shared/components'

import { OngoingTimeDealCard } from '../ongoing-timedeal-card'

import * as S from './styles'

interface Props {
  data: TimeDealProduct[]
  className?: string
}

export const OngoingTimeDealList = ({ data, className }: Props): ReactNode => {
  /** 각 재고의 남은 시간 트래킹 */
  const [remainingTimes, setRemainingTimes] = useState<number[]>([]) // "초" 단위
  useEffect(() => {
    const updateTimes = () => {
      const now = Date.now()
      const updated = data.map(deal => {
        const end = new Date(deal.dealEndTime).getTime()
        const diffInSec = Math.max(0, Math.floor((end - now) / 1000)) // 초 단위
        return diffInSec
      })
      setRemainingTimes(updated)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [data])

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
  if (!data || data.length === 0) {
    timeDealContents = (
      <S.StyledApologizeContent
        title='진행 중인 특가 상품이 없습니다'
        description='빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다'
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
            {data.map((deal, index) => (
              <OngoingTimeDealCard key={deal.productId} data={deal} remainingSec={remainingTimes[index] ?? 0} />
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
      </S.TitleBox>
      {timeDealContents}
    </S.Container>
  )
}
