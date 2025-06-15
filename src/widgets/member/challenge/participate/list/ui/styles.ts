import { responsiveHorizontalPadding } from '@shared/styles/responsive-style'

import styled from '@emotion/styled'

// 전체 페이지 컨테이너
export const Container = styled.div`
  ${responsiveHorizontalPadding};

  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`

// 상단 탭 컨테이너
export const SwitchTapContainer = styled.div`
  width: 100%;

  align-self: center;
  flex-shrink: 0; /* 헤더 크기 고정 */
`

// 카드 리스트 컨테이너
export const CardListContainer = styled.div`
  width: 100%;
  flex: 1; /* 남은 공간 모두 차지하도록 변경 */

  display: flex;
  align-self: center;
  flex-direction: column; /* 세로 방향으로 설정 */
  overflow: hidden; /* 내부 스크롤만 보이도록 설정 */
`

export const ObserverTrigger = styled.div`
  height: 1px;
  padding: 0 20px;
  flex-shrink: 0; /* 크기 고정 */
`
export const EmptySection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const EmptyButton = styled.button`
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  width: 220px;
  height: 40px;
  align-self: center;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
  cursor: pointer;
`
