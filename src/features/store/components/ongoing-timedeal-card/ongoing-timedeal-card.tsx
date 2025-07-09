'use client'

import { ReactNode, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  OrderTimeDealProductBody,
  OrderTimeDealProductHeaders,
  OrderTimeDealProductResponse,
  OrderTimeDealProductVariables,
  TimeDealProduct,
} from '@/entities/store/api'

import { LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useConfirmModalStore, useIdempotencyKeyStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { formatSecondToTime } from '@/shared/lib'

import * as S from './styles'

interface OngoingTimeDealCardProps {
  data: TimeDealProduct
  remainingSec: number
  className?: string
}

export const OngoingTimeDealCard = ({ data, remainingSec, className }: OngoingTimeDealCardProps): ReactNode => {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoggedIn } = useUserStore()
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
      toast('Error', '품절된 상품입니다.')
      return
    }

    const now = new Date().getTime()
    const start = new Date(deal.dealStartTime).getTime()
    const end = new Date(deal.dealEndTime).getTime()

    if (now < start || now > end) {
      toast('Error', '현재는 특가 구매 가능한 시간이 아닙니다.')
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
            onSuccess: () => toast('Success', '구매가 완료되었습니다'),
            onError: () => {
              setLocalStock(prevStock) // 실패 시 rollback
              toast('Error', '구매에 실패했습니다\n다시 시도해주세요')
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
    <S.EmblaSlide key={data.productId} className={className}>
      <S.Timer isRunningOut={isRunningOut}>
        <LucideIcon name='Hourglass' size={18} strokeWidth={2.5} color={isRunningOut ? 'lfRed' : 'lfBlack'} />
        {formatted}
      </S.Timer>
      <S.Card>
        <S.ImageBox>
          <Image src={data.imageUrl} alt={data.title} fill style={{ objectFit: 'cover' }} />
        </S.ImageBox>
        <S.DescriptionSection>
          <S.Title>{data.title}</S.Title>
          <S.Description>{data.description}</S.Description>
          <S.PriceRow>
            <S.Discount>{data.discountedPercentage}%</S.Discount>
            <S.Price>
              <Image src='/icon/leaf.svg' alt='leaf' width={18} height={18} /> {data.discountedPrice}
            </S.Price>
            <S.Origin>{data.defaultPrice}</S.Origin>
          </S.PriceRow>
          <S.Stock soldout={isSoldOut}>{isSoldOut ? '품절' : `남은 재고 ${data.stock}개`}</S.Stock>
          <S.BuyButton onClick={() => handlePurchase(data)}>구매하기</S.BuyButton>
        </S.DescriptionSection>
      </S.Card>
    </S.EmblaSlide>
  )
}
