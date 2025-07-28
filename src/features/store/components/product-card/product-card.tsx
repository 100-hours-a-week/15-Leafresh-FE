'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { MemberLeafCountResponse } from '@/entities/member/api'
import {
  OrderProductBody,
  OrderProductHeaders,
  OrderProductResponse,
  OrderProductVariables,
  Product,
} from '@/entities/store/api'

import { MUTATION_KEYS, useMutationStore, QUERY_KEYS } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useConfirmModalStore, useIdempotencyKeyStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { ApiResponse } from '@/shared/lib'

import * as S from './styles'

interface ProductCardProps {
  product: Product
  memberLeafCount?: number
}

export const ProductCard = ({ product, memberLeafCount }: ProductCardProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

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
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value()),
      })
      return
    }

    if (!product) return

    // #1. 에러 케이스
    // 재고 없음
    if (isSoldOut) {
      toast('Error', '품절된 상품입니다')
      return
    }

    // #2. 나뭇잎 개수 부족
    if (memberLeafCount !== undefined && memberLeafCount < price) {
      toast('Error', '나뭇잎 개수가 부족합니다')
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

        const prevLeafData = queryClient.getQueryData<ApiResponse<MemberLeafCountResponse>>(QUERY_KEYS.MEMBER.LEAVES)

        queryClient.setQueryData<ApiResponse<MemberLeafCountResponse>>(QUERY_KEYS.MEMBER.LEAVES, old => {
          if (!old?.data) return old
          return {
            ...old,
            data: {
              ...old.data,
              currentLeafPoints: old.data.currentLeafPoints - price,
            },
          }
        })

        PurchaseMutate(
          { productId: id, headers, body },
          {
            onSuccess: () => {
              toast('Success', '구매가 완료되었습니다')
            },
            onError: () => {
              // 실패 시 롤백
              setLocalStock(prevStock)
              if (prevLeafData) {
                queryClient.setQueryData(QUERY_KEYS.MEMBER.LEAVES, prevLeafData)
              }

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
        <S.Thumbnail src={imageUrl} alt={title} fill />
      </S.ThumbnailWrapper>
      <S.BuyButton type='button' onClick={handlePurchase}>
        구매하기
      </S.BuyButton>
      <S.TextContent>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        <S.StockNotice isSoldOut={isSoldOut}>
          {isSoldOut ? `남은 재고 없음` : `남은 재고 ${localStock}개`}
        </S.StockNotice>
        <S.PriceRow>
          <S.LeafIcon src='/icon/leaf.svg' alt='leaf' width={24} height={24} />
          <S.Price>{price.toLocaleString()}</S.Price>
        </S.PriceRow>
      </S.TextContent>
    </S.Card>
  )
}
