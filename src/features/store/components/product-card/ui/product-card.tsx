'use client'

import { useRouter } from 'next/navigation'

import {
  OrderProductBody,
  OrderProductHeaders,
  OrderProductResponse,
  OrderProductVariables,
} from '@entities/store/api/product/order-proudct'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useIdempotencyKeyStore } from '@shared/context'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'

import { ProductCardProps } from '../model/types'
import * as S from './styles'

export const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter()
  const openToast = useToast()
  const { isLoggedIn } = useAuth()
  const { openConfirmModal } = useConfirmModalStore()
  const { IdempotencyKey, regenerateIdempotencyKey } = useIdempotencyKeyStore()

  const { id, description, imageUrl, price, stock, title } = product

  const isSoldOut: boolean = stock <= 0

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
      openToast(ToastType.Error, '품절된 상품입니다.')
      return
    }

    // #2. 구매
    openConfirmModal({
      title: `${title}를 구매하시겠습니까?`,
      description: `가격은 나뭇잎 ${price}개 입니다`,
      onConfirm: () => {
        regenerateIdempotencyKey() // 새 멱등키 발급
        const body: OrderProductBody = {
          quantity: 1,
        }
        const headers: OrderProductHeaders = {
          'Idempotency-Key': IdempotencyKey,
        }
        return PurchaseMutate(
          { productId: id, headers, body },
          {
            onSuccess: () => {
              openToast(ToastType.Success, '구매가 완료되었습니다')
            },
            onError: () => {
              openToast(ToastType.Error, '구매에 실패했습니다\n다시 시도해주세요')
            },
            onSettled: () => {
              regenerateIdempotencyKey() // 멱등키 초기화 (재발급)
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
          <S.LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} />
          <S.Price>{price.toLocaleString()}</S.Price>
        </S.PriceRow>
      </S.TextContent>
    </S.Card>
  )
}
