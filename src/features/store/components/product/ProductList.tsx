'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import ApologizeContent from '@shared/components/apologize/apologize'
import Loading from '@shared/components/loading'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'
import { theme } from '@shared/styles/theme'

import { useInfiniteProducts } from '../../hook/useInfiniteProducts'
import ProductCard from './ProductCard'

interface ProductListProps {
  className?: string
}

const ProductList = ({ className }: ProductListProps): ReactNode => {
  const [input, setInput] = useState<string>('') // 트래킹 용
  const [search, setSearch] = useState<string>('') // API 제출 용

  const observerRef = useRef<HTMLDivElement>(null)

  // 일반 상품 목록 조회
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts(search)

  const products = data?.pages.flatMap(page => page?.data?.products || []) ?? []
  // const products: Product[] = dummyProducts

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
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearch(input)
  }

  /** 상품 리스트 */
  let contents
  /** 일반 상품이 없는 경우 */
  const hasProducts: boolean = !(products.length === 0)
  if (!hasProducts) {
    contents = (
      <ApologizeContent title='준비된 일반 상품이 없습니다' description='빠른 시일 내로 좋은 상품으로 찾아뵙겠습니다' />
    )
  } else {
    /** 일반 상품이 있는 경우 */
    contents = (
      <>
        <SearchBar onSubmit={handleSearchSubmit}>
          <SearchInput
            type='text'
            inputMode='search'
            placeholder='무엇을 찾아드릴까요?'
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </SearchBar>
        <ProductGrid>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {isFetchingNextPage && <StyledLoading />}
          {hasNextPage && <ObserverTrigger ref={observerRef} />}
        </ProductGrid>
      </>
    )
  }

  return <ContentWrapper hasProducts={hasProducts}>{contents}</ContentWrapper>
}

export default ProductList

const ContentWrapper = styled.div<{ hasProducts: boolean }>`
  flex: 1;

  ${responsiveHorizontalPadding};
  margin-top: 20px;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: ${({ hasProducts }) => (!hasProducts ? 'center' : 'flex-start')};
  align-items: center;
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 8px;
`

const SearchBar = styled.form`
  width: 100%;
  padding-bottom: 10px;
`

const SearchInput = styled.input`
  width: 100%;
  height: 45px;
  padding: 10px 15px 10px 35px;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.lfGray.base};
  background-color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.sm};
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px;
`

const ObserverTrigger = styled.div`
  height: 1px;
`

const StyledLoading = styled(Loading)`
  grid-column: span 2;
`

// const dummyProducts: Product[] = [
//   {
//     id: 1,
//     title:
//       '친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 친환경 텀블러 ',
//     description:
//       '언제 어디서나 사용 가능한 그린 텀블러 언제 어디서나 사용 가능한 그린 텀블러 언제 어디서나 사용 가능한 그린 텀블러 언제 어디서나 사용 가능한 그린 텀블러 ',
//     imageUrl: '/image/Main_1.png',
//     price: 4000,
//     stock: 0,
//   },
//   {
//     id: 2,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
//   {
//     id: 3,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
//   {
//     id: 4,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
//   {
//     id: 5,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
//   {
//     id: 6,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
//   {
//     id: 7,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
//   {
//     id: 8,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
//   {
//     id: 9,
//     title: '대나무 칫솔',
//     description: '지구를 생각한 생분해 칫솔',
//     imageUrl: '/image/Main_1.png',
//     price: 3000,
//     stock: 5,
//   },
// ]
// const dummyProducts: Product[] = []
