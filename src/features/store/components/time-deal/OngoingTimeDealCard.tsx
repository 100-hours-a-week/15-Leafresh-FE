import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

import { TimeDealProduct } from '@features/store/api/get-timedeals'
import { OrderTimeDealProductResponse, OrderTimeDealProductVariables } from '@features/store/api/order-timedeal'
import useRemainingTime from '@features/store/hook/useRemainingTime'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { media } from '@shared/styles/emotion/media'
import { theme } from '@shared/styles/theme'

interface OngoingTimeDealCardProps {
  data: TimeDealProduct | undefined
  className?: string
}

const OngoingTimeDealCard = ({ data, className }: OngoingTimeDealCardProps): ReactNode => {
  const router = useRouter()
  const openToast = useToast()
  const { isLoggedIn } = useAuth()
  const { openConfirmModal } = useConfirmModalStore()

  const remaining = useRemainingTime({ target: data?.dealEndTime ?? '' })

  /** 특가 상품 구매 이력 생성 */
  const { mutate: PurchaseMutate, isPending: isPurchasing } = useMutationStore<
    OrderTimeDealProductResponse,
    OrderTimeDealProductVariables
  >(MUTATION_KEYS.STORE.TIME_DEAL.ORDER)

  /** 이벤트 핸들러 */
  const handlePurchase = (dealId: number) => {
    // #0. 로그인 상태가 아닐 때
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }

    if (!data) return

    // #1. 에러 케이스
    // 재고 없음
    if (data.stock <= 0) {
      openToast(ToastType.Error, '품절된 상품입니다.')
      return
    }

    // 진행중이지 않음
    if (data.timeDealStatus !== 'ONGOING') {
      openToast(ToastType.Error, '특가 진행 중인 상품이 아닙니다.')
      return
    }

    // 특가 시간 아님
    const now = new Date().getTime()
    const start = new Date(data.dealStartTime).getTime()
    const end = new Date(data.dealEndTime).getTime()

    if (now < start || now > end) {
      openToast(ToastType.Error, '현재는 특가 구매 가능한 시간이 아닙니다.')
      return
    }
    openConfirmModal({
      title: `${data.title}를 구매하시겠습니까?`,
      description: `할인된 가격은 나뭇잎 ${data.discountedPrice}개 입니다`,
      onConfirm: () =>
        PurchaseMutate(
          { productId: dealId },
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

  let content
  /** 진행중인 타임딜 상품이 없는 경우 */
  if (!data) {
    content = (
      <EmptySection>
        <Image src='/image/apologize_character.svg' alt='사죄 이미지' width={140} height={140} />
        <EmptyTitle>진행 중인 특가 상품이 없습니다</EmptyTitle>
        <EmptyDescription>빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다</EmptyDescription>
        <EmptyDescription>감사합니다.</EmptyDescription>
      </EmptySection>
    )
  } else {
    /** 진행중인 타임딜 상품이 있는 경우 */
    const {
      dealEndTime,
      imageUrl,
      title,
      timeDealStatus,
      description,
      discountedPercentage,
      discountedPrice,
      defaultPrice,
      stock,
      productId,
    } = data

    content = (
      <OngoingCard>
        <Timer>
          <LucideIcon name='Hourglass' size={24} />
          {data ? remaining : ''}
        </Timer>
        <InfoCard>
          <OngoingImageBox>
            <Image src={imageUrl} alt={title} fill style={{ objectFit: 'cover' }} />
          </OngoingImageBox>
          <DescriptionSection>
            <Title>{title}</Title>
            <Description>{description}</Description>
            <PriceBox>
              <Left>
                <Discount>{discountedPercentage}%</Discount>
                <Price>
                  <LeafIcon src='/icon/leaf.png' alt='leaf' width={24} height={24} /> {discountedPrice}
                </Price>
                <Origin>{defaultPrice}</Origin>
              </Left>
              <Stock>남은 재고 {stock}개</Stock>
            </PriceBox>
            <BuyButton type='button' onClick={() => handlePurchase(productId)}>
              구매하기
            </BuyButton>
          </DescriptionSection>
        </InfoCard>
      </OngoingCard>
    )
  }

  return (
    <OngoingCard>
      <OngoingTitle>🔥 지금만 이 가격</OngoingTitle>
      <SubText>세상은 1등만 기억해!</SubText>
      {content}
    </OngoingCard>
  )
}

export default OngoingTimeDealCard

const EmptySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`
const EmptyTitle = styled.div`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
  margin: 16px 0 16px 0;
`

const EmptyDescription = styled.p`
  font-size: ${theme.fontSize.base};
  color: ${theme.colors.lfDarkGray.base};
  margin-top: 6px;
  text-align: center;
`

const OngoingCard = styled.div`
  margin: 20px 0;
`
const OngoingTitle = styled.h2`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semiBold};
`

const SubText = styled.p`
  margin: 8px 0px;
  color: ${theme.colors.lfDarkGray.base};
  font-size: ${theme.fontSize.sm};

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`
const Timer = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0;

  display: flex;
  align-items: center;
  gap: 4px;
`

const InfoCard = styled.div`
  box-shadow: ${theme.shadow.lfInput};
  border-radius: ${theme.radius.sm};

  cursor: pointer;
`

const OngoingImageBox = styled.div`
  width: 100%;

  position: relative;
  border-top-right-radius: ${theme.radius.md};
  border-top-left-radius: ${theme.radius.md};
  overflow: hidden;
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

const PriceBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`

const Left = styled.div`
  display: flex;
  align-items: center;
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

const Stock = styled.span`
  font-size: ${theme.fontSize.sm};
`

const BuyButton = styled.button`
  margin-top: 12px;
  width: 100%;
  height: 44px;
  background: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  font-weight: ${theme.fontWeight.medium};
  font-size: ${theme.fontSize.sm};
  cursor: pointer;

  ${media.afterMobile} {
    font-size: ${theme.fontSize.base};
  }
`

const LeafIcon = styled(Image)`
  width: 24px;
  aspect-ratio: 1/1;
`
