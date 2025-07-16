import styled from '@emotion/styled'

import { responsiveHorizontalPadding } from '@/shared/styles'

export const Container = styled.div`
  ${responsiveHorizontalPadding};

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;

  margin: 0 auto;

  height: 100%;
`

// 상단 탭 컨테이너
export const SwitchTapContainer = styled.div`
  width: 100%;

  align-self: center;
  flex-shrink: 0; /* 헤더 크기 고정 */
`

// 카드 리스트 컨테이너
export const CardListContainer = styled.div<{ isChallengeExists: boolean }>`
  width: 100%;
  height: ${({ isChallengeExists }) => (!isChallengeExists ? '100%' : 'fit-content')};

  display: flex;
  align-self: center;
  flex-direction: column; /* 세로 방향으로 설정 */
  overflow: hidden; /* 내부 스크롤만 보이도록 설정 */
  gap: 24px;
`

export const ListWrapper = styled.div`
  margin-top: 10px;
  flex: 1;

  flex-direction: column;
  gap: 16px;
  overflow-y: auto; /* 내부 스크롤 활성화 */
`

export const ObserverTrigger = styled.div`
  height: 1px;
  padding: 0 20px;
  flex-shrink: 0; /* 크기 고정 */
`

export const EndMessage = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`
