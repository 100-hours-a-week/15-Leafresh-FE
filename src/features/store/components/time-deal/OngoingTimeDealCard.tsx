import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useState } from 'react'
import styled from '@emotion/styled'

import { TimeDealProduct } from '@features/store/api/get-timedeals'
import {
  OrderTimeDealProductBody,
  OrderTimeDealProductHeaders,
  OrderTimeDealProductResponse,
  OrderTimeDealProductVariables,
} from '@features/store/api/order-timedeal'
import ApologizeContent from '@shared/components/apologize/apologize'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useIdempotencyKeyStore } from '@shared/context'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import { formatSecondToTime } from '@shared/lib/date/utils'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { media } from '@shared/styles/emotion/media'
import { theme } from '@shared/styles/theme'

interface Props {
  data: TimeDealProduct[]
  className?: string
}

const OngoingTimeDealCard = ({ data, className }: Props): ReactNode => {
  const router = useRouter()
  const openToast = useToast()
  const { isLoggedIn } = useAuth()
  const { openConfirmModal } = useConfirmModalStore()
  const { IdempotencyKey, regenerateIdempotencyKey } = useIdempotencyKeyStore()

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

  const handlePurchase = (deal: TimeDealProduct) => {
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }

    if (deal.stock <= 0) {
      openToast(ToastType.Error, '품절된 상품입니다.')
      return
    }

    const now = new Date().getTime()
    const start = new Date(deal.dealStartTime).getTime()
    const end = new Date(deal.dealEndTime).getTime()

    if (now < start || now > end) {
      openToast(ToastType.Error, '현재는 특가 구매 가능한 시간이 아닙니다.')
      return
    }

    openConfirmModal({
      title: `${deal.title}를 구매하시겠습니까?`,
      description: `할인된 가격은 나뭇잎 ${deal.discountedPrice}개 입니다.`,
      onConfirm: () => {
        regenerateIdempotencyKey() // 새 멱등키 발급
        const body: OrderTimeDealProductBody = {
          quantity: 1,
        }
        const headers: OrderTimeDealProductHeaders = {
          'Idempotency-Key': IdempotencyKey,
        }
        return PurchaseMutate(
          { productId: deal.productId, headers, body },
          {
            onSuccess: () => openToast(ToastType.Success, '구매가 완료되었습니다'),
            onSettled: () => {
              regenerateIdempotencyKey() // 멱등키 초기화 (재발급)
            },
          },
        )
      },
    })
  }

  const { mutate: PurchaseMutate } = useMutationStore<OrderTimeDealProductResponse, OrderTimeDealProductVariables>(
    MUTATION_KEYS.STORE.TIME_DEAL.ORDER,
  )

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
            {data.map((deal, index) => {
              const remainingSec = remainingTimes[index] ?? 0
              const formatted = remainingSec !== 0 ? formatSecondToTime(remainingSec) : '마감되었습니다!' // 00:00:00 형식
              const isRunningOut = remainingSec <= 300
              const isSoldOut = deal.stock <= 0
              return (
                <EmblaSlide key={deal.productId}>
                  <Timer isRunningOut={isRunningOut}>
                    <LucideIcon
                      name='Hourglass'
                      size={18}
                      strokeWidth={2.5}
                      color={isRunningOut ? 'lfRed' : 'lfBlack'}
                    />
                    {formatted}
                  </Timer>
                  <Card>
                    <ImageBox>
                      <Image src={deal.imageUrl} alt={deal.title} fill style={{ objectFit: 'cover' }} />
                    </ImageBox>
                    <DescriptionSection>
                      <Title>{deal.title}</Title>
                      <Description>{deal.description}</Description>
                      <PriceRow>
                        <Discount>{deal.discountedPercentage}%</Discount>
                        <Price>
                          <Image src='/icon/leaf.png' alt='leaf' width={18} height={18} /> {deal.discountedPrice}
                        </Price>
                        <Origin>{deal.defaultPrice}</Origin>
                      </PriceRow>
                      <Stock soldout={isSoldOut}>{isSoldOut ? '품절' : `남은 재고 ${deal.stock}개`}</Stock>
                      <BuyButton onClick={() => handlePurchase(deal)}>구매하기</BuyButton>
                    </DescriptionSection>
                  </Card>
                </EmblaSlide>
              )
            })}
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

export default OngoingTimeDealCard

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
const EmblaSlide = styled.div`
  flex: 0 0 100%;
  padding: 0 12px;
  box-sizing: border-box;
`
const Card = styled.div`
  background: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  box-shadow: ${theme.shadow.lfInput};
  overflow: hidden;
`

const Timer = styled.div<{ isRunningOut: boolean }>`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
  margin: 4px 0;
  color: ${({ isRunningOut }) => (isRunningOut ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};

  display: flex;
  align-items: center;
  gap: 4px;
`
const ImageBox = styled.div`
  position: relative;
  aspect-ratio: 2/1;
`
const DescriptionSection = styled.div`
  padding: 10px 14px;
`

const Title = styled.h3`
  padding: 4px 0;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.bold};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.lg};
  }
`

const Description = styled.p`
  font-size: ${theme.fontSize.sm};
  margin: 8px 0;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
    margin: 12px 0;
  }
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`

const Discount = styled.span`
  color: #ff7043;
  font-weight: ${theme.fontWeight.bold};
`

const Price = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};

  display: flex;
  align-items: center;
  gap: 3px;
`

const Origin = styled.del`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfGray.base};
`

const Stock = styled.div<{ soldout: boolean }>`
  margin: 8px 0;
  font-size: ${theme.fontSize.sm};
  color: ${({ soldout }) => (soldout ? theme.colors.lfRed.base : theme.colors.lfDarkGray.base)};
`
const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};

  cursor: pointer;
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
