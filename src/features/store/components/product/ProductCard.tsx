'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'

import { Product } from '@features/store/api/get-products'
import { OrderProductResponse, OrderProductVariables } from '@features/store/api/order-proudcts'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import { media } from '@shared/styles/emotion/media'
import { theme } from '@shared/styles/theme'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter()
  const openToast = useToast()
  const { isLoggedIn } = useAuth()
  const { openConfirmModal } = useConfirmModalStore()

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
      onConfirm: () =>
        PurchaseMutate(
          { productId: id },
          {
            onSuccess: () => {
              openToast(ToastType.Success, '구매가 완료되었습니다')
            },
            onError: () => {
              openToast(ToastType.Error, '구매에 실패했습니다\n다시 시도해주세요')
            },
          },
        ),
    })
  }

  return (
    <Card>
      <ThumbnailWrapper>
        <Thumbnail src={imageUrl} alt={title} width={180} height={180} />
      </ThumbnailWrapper>
      <BuyButton type='button' onClick={handlePurchase}>
        구매하기
      </BuyButton>
      <TextContent>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <StockNotice isSoldOut={isSoldOut}>{isSoldOut ? `남은 재고 없음` : `남은 재고 ${stock}개`}</StockNotice>
        <PriceRow>
          <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} />
          <Price>{price.toLocaleString()}</Price>
        </PriceRow>
      </TextContent>
    </Card>
  )
}

export default ProductCard

const Card = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  cursor: pointer;
`

const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: ${theme.radius.base};
`

const Thumbnail = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const TextContent = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
`

const Title = styled.h3`
  margin: 12px 0 6px 0;
  font-size: ${theme.fontSize.md};
  font-weight: ${theme.fontWeight.semiBold};
`

const Description = styled.p`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
  margin-top: 4px;
`

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 10px 0 8px 0;
`

const Price = styled.span`
  font-weight: ${theme.fontWeight.semiBold};
  color: ${theme.colors.lfBlack.base};
`

const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`

const StockNotice = styled.div<{ isSoldOut: boolean }>`
  font-size: ${theme.fontSize.xs};
  color: ${({ isSoldOut }) => (isSoldOut ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};

  margin-top: 8px;
`

const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${theme.colors.lfWhite.base};
  color: ${theme.colors.lfBlack.base};
  border: 1px solid ${theme.colors.lfLightGray.base};
  border-radius: ${theme.radius.base};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }

  &:hover {
    background: ${theme.colors.lfInputBackground.base};
  }
`
