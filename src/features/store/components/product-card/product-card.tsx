'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  OrderProductBody,
  OrderProductHeaders,
  OrderProductResponse,
  OrderProductVariables,
  Product,
} from '@/entities/store/api'

import { MUTATION_KEYS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useConfirmModalStore, useIdempotencyKeyStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'

import * as S from './styles'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter()
  const { toast } = useToast()
  const { isLoggedIn } = useUserStore()
  const { openConfirmModal } = useConfirmModalStore()
  const { IdempotencyKey, regenerateIdempotencyKey } = useIdempotencyKeyStore()

  const { id, description, imageUrl, price, stock, title } = product

  const [localStock, setLocalStock] = useState(product.stock)

  const isSoldOut: boolean = localStock <= 0 // 품절 여부

  /** 일반 상품 구매 이력 생성 */
  const { mutate: PurchaseMutate, isPending: isPurchasing } = useMutationStore<
    OrderProductResponse,
    OrderProductVariables
  >(MUTATION_KEYS.STORE.PRODUCTS.ORDER)

  /** 이벤트 핸들러 */
  const handlePurchase = () => {
    // #0. 로그인 상태가 아닐 때
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }

    if (!product) return

    // #1. 에러 케이스
    // 재고 없음
    if (isSoldOut) {
      toast('Error', '품절된 상품입니다.')
      return
    }

    // #2. 구매
    openConfirmModal({
      title: `${title}를 구매하시겠습니까?`,
      description: `가격은 나뭇잎 ${price}개 입니다`,
      onConfirm: () => {
        regenerateIdempotencyKey()
        const body: OrderProductBody = { quantity: 1 }
        const headers: OrderProductHeaders = { 'Idempotency-Key': IdempotencyKey }

        // 낙관적 업데이트
        const prevStock = localStock
        setLocalStock(prev => prev - 1)

        PurchaseMutate(
          { productId: id, headers, body },
          {
            onSuccess: () => {
              toast('Success', '구매가 완료되었습니다')
            },
            onError: () => {
              setLocalStock(prevStock) // 실패 시 롤백
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
    <S.Card>
      <S.ThumbnailWrapper>
        <S.Thumbnail src={imageUrl} alt={title} width={180} height={180} />
      </S.ThumbnailWrapper>
      <S.BuyButton type='button' onClick={handlePurchase}>
        구매하기
      </S.BuyButton>
      <S.TextContent>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        <S.StockNotice isSoldOut={isSoldOut}>{isSoldOut ? `남은 재고 없음` : `남은 재고 ${stock}개`}</S.StockNotice>
        <S.PriceRow>
          <S.LeafIcon src='/icon/leaf.svg' alt='leaf' width={24} height={24} />
          <S.Price>{price.toLocaleString()}</S.Price>
        </S.PriceRow>
      </S.TextContent>
    </S.Card>
  )
}
