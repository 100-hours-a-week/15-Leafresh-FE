import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'

import { TimeDealProduct } from '@entities/store/api/timedeal/get-timedeal-list'
import {
  OrderTimeDealProductBody,
  OrderTimeDealProductHeaders,
  OrderTimeDealProductResponse,
  OrderTimeDealProductVariables,
} from '@entities/store/api/timedeal/order-timedeal'
import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import { media } from '@shared/config/style/media'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route'
import { useIdempotencyKeyStore } from '@shared/context'
import { useConfirmModalStore } from '@shared/context/modal/confirm-modal-store'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/use-auth/useAuth'
import { useToast } from '@shared/hooks/use-toast/useToast'
import { formatSecondToTime } from '@shared/lib/date/utils'

interface OngoingTimeDealCardProps {
  data: TimeDealProduct
  remainingSec: number
  className?: string
}

export const OngoingTimeDealCard = ({ data, remainingSec, className }: OngoingTimeDealCardProps): ReactNode => {
  const router = useRouter()
  const openToast = useToast()
  const { isLoggedIn } = useAuth()
  const { openConfirmModal } = useConfirmModalStore()
  const { IdempotencyKey, regenerateIdempotencyKey } = useIdempotencyKeyStore()

  const [localStock, setLocalStock] = useState<number>(data.stock) // 재고

  const formatted = remainingSec !== 0 ? formatSecondToTime(remainingSec) : '마감되었습니다!' // 00:00:00 형식
  const isRunningOut = remainingSec <= 300
  const isSoldOut = localStock <= 0

  const { mutate: PurchaseMutate } = useMutationStore<OrderTimeDealProductResponse, OrderTimeDealProductVariables>(
    MUTATION_KEYS.STORE.TIME_DEAL.ORDER,
  )

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
        regenerateIdempotencyKey()
        const body: OrderTimeDealProductBody = { quantity: 1 }
        const headers: OrderTimeDealProductHeaders = { 'Idempotency-Key': IdempotencyKey }

        const prevStock = localStock
        setLocalStock(prev => prev - 1) // 낙관적 업데이트

        return PurchaseMutate(
          { productId: deal.dealId, headers, body },
          {
            onSuccess: () => openToast(ToastType.Success, '구매가 완료되었습니다'),
            onError: () => {
              setLocalStock(prevStock) // 실패 시 rollback
              openToast(ToastType.Error, '구매에 실패했습니다\n다시 시도해주세요')
            },
            onSettled: () => {
              regenerateIdempotencyKey()
            },
          },
        )
      },
    })
  }

  return (
    <EmblaSlide key={data.productId} className={className}>
      <Timer isRunningOut={isRunningOut}>
        <LucideIcon name='Hourglass' size={18} strokeWidth={2.5} color={isRunningOut ? 'lfRed' : 'lfBlack'} />
        {formatted}
      </Timer>
      <Card>
        <ImageBox>
          <Image src={data.imageUrl} alt={data.title} fill style={{ objectFit: 'cover' }} />
        </ImageBox>
        <DescriptionSection>
          <Title>{data.title}</Title>
          <Description>{data.description}</Description>
          <PriceRow>
            <Discount>{data.discountedPercentage}%</Discount>
            <Price>
              <Image src='/icon/leaf.png' alt='leaf' width={18} height={18} /> {data.discountedPrice}
            </Price>
            <Origin>{data.defaultPrice}</Origin>
          </PriceRow>
          <Stock soldout={isSoldOut}>{isSoldOut ? '품절' : `남은 재고 ${data.stock}개`}</Stock>
          <BuyButton onClick={() => handlePurchase(data)}>구매하기</BuyButton>
        </DescriptionSection>
      </Card>
    </EmblaSlide>
  )
}

const EmblaSlide = styled.div`
  flex: 0 0 100%;
  padding: 0 12px;
  box-sizing: border-box;
`
const Card = styled.div`
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  overflow: hidden;
`

const Timer = styled.div<{ isRunningOut: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  margin: 4px 0;
  color: ${({ isRunningOut, theme }) => (isRunningOut ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};

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
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.bold};

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin: 8px 0;

  ${media.afterMobile} {
    font-size: ${({ theme }) => theme.fontSize.base};
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
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`

const Price = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};

  display: flex;
  align-items: center;
  gap: 3px;
`

const Origin = styled.del`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfGray.base};
`

const Stock = styled.div<{ soldout: boolean }>`
  margin: 8px 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ soldout, theme }) => (soldout ? theme.colors.lfRed.base : theme.colors.lfDarkGray.base)};
`
const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  cursor: pointer;
`
