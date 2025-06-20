import useEmblaCarousel from 'embla-carousel-react'
import { ReactNode, useEffect, useState } from 'react'

import { OngoingTimeDealCard } from '../ongoing-timedeal-card'

import { TimeDealProduct } from '@/entities/store/api'
import { ApologizeContent, LucideIcon } from '@/shared/components'
import { media, theme } from '@/shared/config'
import styled from '@emotion/styled'

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
      <StyledApologizeContent
        title='진행 중인 특가 상품이 없습니다'
        description='빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다'
      />
    )
  } else {
    /** 타임딜 상품이 있는 경우 */
    timeDealContents = (
      <CarouselWrapper>
        {canScrollPrev && (
          <LeftButton onClick={() => emblaApi?.scrollPrev()}>
            <LucideIcon name='ChevronLeft' size={24} />
          </LeftButton>
        )}

        <Embla ref={emblaRef}>
          <EmblaTrack>
            {data.map((deal, index) => (
              <OngoingTimeDealCard key={deal.productId} data={deal} remainingSec={remainingTimes[index] ?? 0} />
            ))}
          </EmblaTrack>
        </Embla>

        {canScrollNext && (
          <RightButton onClick={() => emblaApi?.scrollNext()}>
            <LucideIcon name='ChevronRight' size={24} />
          </RightButton>
        )}
      </CarouselWrapper>
    )
  }
  return (
    <Container className={className}>
      <TitleBox>
        <SectionTitle>🔥 지금만 이 가격</SectionTitle>
        <SubText>세상은 1등만 기억해!</SubText>
      </TitleBox>
      {timeDealContents}
    </Container>
  )
}

const Container = styled.section`
  margin: 20px 0;
  width: 100%;
  position: relative;
  cursor: pointer;
`
const TitleBox = styled.div`
  margin-bottom: 12px;
`

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`

const SubText = styled.p`
  margin: 8px 0px;
  color: ${theme.colors.lfDarkGray.base};
  font-size: ${theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`

const CarouselWrapper = styled.div`
  width: 100%;

  position: relative;
`
const Embla = styled.div`
  padding: 6px 0;
  overflow: hidden;
`
const EmblaTrack = styled.div`
  display: flex;
`

const MoveButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.full};
  box-shadow: ${theme.shadow.lfInput};
  width: 36px;
  height: 36px;
  z-index: 10;

  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.lfInputBackground.base};
  }
`

const LeftButton = styled(MoveButton)`
  left: 0;
`
const RightButton = styled(LeftButton)`
  left: auto;
  right: 0;
`

const StyledApologizeContent = styled(ApologizeContent)`
  margin: 24px 0;
`
