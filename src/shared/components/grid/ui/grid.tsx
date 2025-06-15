import { ReactNode } from 'react'

import { Grid, GridProps } from '@chakra-ui/react'

export interface GridBoxProps extends Omit<GridProps, 'display' | 'templateColumns'> {
  /** 자식 요소들(ReactNode 배열) */
  children: ReactNode[]
  /** 열 개수 (none 이면 auto-fit/minmax 사용) */
  columns?: number
  /** 고정 너비 기반 동적 컬럼 (auto-fit/minmax) */
  childWidth?: string
  /** 행 간격 */
  rowGap?: GridProps['rowGap']
  /** 열 간격 */
  columnGap?: GridProps['columnGap']
  /** 아이템 수평 정렬 */
  justifyItems?: GridProps['justifyItems']
  /** 아이템 수직 정렬 */
  alignItems?: GridProps['alignItems']
  /** 그리드 컨테이너 수평 정렬 */
  justifyContent?: GridProps['justifyContent']
  /** 그리드 컨테이너 수직 정렬 */
  alignContent?: GridProps['alignContent']
  /** 자동 배치 흐름 */
  autoFlow?: GridProps['gridAutoFlow']
  /** 행 레이아웃 템플릿 (필요 시) */
  templateRows?: GridProps['templateRows']
}

export const GridBox = ({
  children,
  columns,
  childWidth,
  rowGap,
  columnGap,
  justifyItems,
  alignItems,
  justifyContent,
  alignContent,
  autoFlow,
  templateRows,
  ...rest
}: GridBoxProps) => {
  // childWidth 가 주어지면 auto-fit/minmax, 없으면 repeat(columns, max-content)
  const templateColumns = childWidth
    ? `repeat(auto-fit, minmax(${childWidth}, 1fr))`
    : `repeat(${columns ?? 1}, max-content)`

  return (
    <Grid
      display='grid'
      templateColumns={templateColumns}
      templateRows={templateRows}
      rowGap={rowGap}
      columnGap={columnGap}
      justifyItems={justifyItems}
      alignItems={alignItems}
      justifyContent={justifyContent}
      alignContent={alignContent}
      gridAutoFlow={autoFlow}
      {...rest}
    >
      {children}
    </Grid>
  )
}
