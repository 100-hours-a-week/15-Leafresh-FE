import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

import { TimeDealProduct } from '@entities/store/api/timedeal/get-timedeal-list'
import {
  OrderTimeDealProductBody,
  OrderTimeDealProductHeaders,
  OrderTimeDealProductResponse,
  OrderTimeDealProductVariables,
} from '@entities/store/api/timedeal/order-timedeal'
import ApologizeContent from '@shared/components/apologize/ui/apologize'
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

import { OngoingTimeDealCardProps } from '../model/types'
import * as S from './styles'

export const OngoingTimeDealCard = ({ data, className }: OngoingTimeDealCardProps): ReactNode => {
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
      <ApologizeContent title='진행 중인 특가 상품이 없습니다' description='빠른 시일 내로 찾아뵙겠습니다' />
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
            {data.map((deal, index) => {
              const remainingSec = remainingTimes[index] ?? 0
              const formatted = remainingSec !== 0 ? formatSecondToTime(remainingSec) : '마감되었습니다!' // 00:00:00 형식
              const isRunningOut = remainingSec <= 300
              const isSoldOut = deal.stock <= 0
              return (
                <S.EmblaSlide key={deal.productId}>
                  <S.Timer isRunningOut={isRunningOut}>
                    <LucideIcon
                      name='Hourglass'
                      size={18}
                      strokeWidth={2.5}
                      color={isRunningOut ? 'lfRed' : 'lfBlack'}
                    />
                    {formatted}
                  </S.Timer>
                  <S.Card>
                    <S.ImageBox>
                      <Image src={deal.imageUrl} alt={deal.title} fill style={{ objectFit: 'cover' }} />
                    </S.ImageBox>
                    <S.DescriptionSection>
                      <S.Title>{deal.title}</S.Title>
                      <S.Description>{deal.description}</S.Description>
                      <S.PriceRow>
                        <S.Discount>{deal.discountedPercentage}%</S.Discount>
                        <S.Price>
                          <Image src='/icon/leaf.png' alt='leaf' width={18} height={18} /> {deal.discountedPrice}
                        </S.Price>
                        <S.Origin>{deal.defaultPrice}</S.Origin>
                      </S.PriceRow>
                      <S.Stock soldout={isSoldOut}>{isSoldOut ? '품절' : `남은 재고 ${deal.stock}개`}</S.Stock>
                      <S.BuyButton onClick={() => handlePurchase(deal)}>구매하기</S.BuyButton>
                    </S.DescriptionSection>
                  </S.Card>
                </S.EmblaSlide>
              )
            })}
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
