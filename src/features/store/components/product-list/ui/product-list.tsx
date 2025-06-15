'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

import ApologizeContent from '@shared/components/apologize/ui/apologize'

import { Product } from '../../../../../entities/store/api/product/get-product-list'
import { useInfiniteProducts } from '../../../api/use-get-product-list'
import { ProductCard } from '../../product-card'
import { ProductListProps } from '../model/types'
import * as S from './styles'

const dummyProducts: Product[] = [
  {
    id: 1,
    title:
      '친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 ',
    description:
      '언제 어디서나 사용 가능한 그린 텀블러 언제 어디서나 사용 가능한 그린 텀블러 언제 어디서나 사용 가능한 그린 텀블러 언제 어디서나 사용 가능한 그린 텀블러 ',
    imageUrl: '/image/Main_1.png',
    price: 4000,
    stock: 0,
  },
  {
    id: 2,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
  {
    id: 3,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
  {
    id: 4,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
  {
    id: 5,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
  {
    id: 6,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
  {
    id: 7,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
  {
    id: 8,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
  {
    id: 9,
    title: '대나무 칫솔',
    description: '지구를 생각한 생분해 칫솔',
    imageUrl: '/image/Main_1.png',
    price: 3000,
    stock: 5,
  },
]
// const dummyProducts: Product[] = []

export const ProductList = ({ className }: ProductListProps): ReactNode => {
  const [input, setInput] = useState<string>('') // 트래킹 용
  const [search, setSearch] = useState<string>('') // API 제출 용

  const observerRef = useRef<HTMLDivElement>(null)

  // 일반 상품 목록 조회
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts(search)

  // TODO: API 추가하면서 삭제 필요
  // const products = data?.pages.flatMap(page => page?.data?.products || []) ?? []
  const products: Product[] = dummyProducts

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage()
        }
      },
      { rootMargin: '100px' },
    )

    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  /** 이벤트 핸들러 */
  const handleSearchSubmit = () => {
    setSearch(input)
  }

  /** 상품 리스트 */
  let contents
  /** 일반 상품이 없는 경우 */
  if (products.length === 0) {
    contents = (
      <ApologizeContent title='준비된 일반 상품이 없습니다' description='빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다' />
    )
  } else {
    /** 일반 상품이 있는 경우 */
    contents = (
      <>
        <S.SearchBar onSubmit={handleSearchSubmit}>
          <S.SearchInput
            type='text'
            inputMode='search'
            placeholder='무엇을 찾아드릴까요?'
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </S.SearchBar>
        <S.ProductGrid>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {hasNextPage && <S.ObserverTrigger ref={observerRef} />}
        </S.ProductGrid>
      </>
    )
  }

  return <S.ContentWrapper>{contents}</S.ContentWrapper>
}
