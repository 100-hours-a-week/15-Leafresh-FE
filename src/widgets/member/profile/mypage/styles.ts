import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { responsiveHorizontalPadding } from '@/shared/styles'

const slideRotateIn = keyframes`
  0% {
    transform: translateX(-50%) translateY(200px) rotateY(0deg); /* 뷰포트 아래쪽에서 시작 */
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(-50%) rotateY(360deg); /* 화면 중앙 + 360도 회전 */
    opacity: 1;
  }
`

export const Container = styled.div<{ isScroll: boolean }>`
  ${responsiveHorizontalPadding};

  display: flex;
  flex-direction: column;

  gap: 20px;
  overflow: ${({ isScroll }) => (isScroll ? 'hidden' : 'auto')};
`

export const ProfileSection = styled.div`
  justify-content: center;
`

export const FeedbackBox = styled.div`
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  display: flex;
  padding: 15px;
  flex-direction: column;
  background-color: #eff9e8;

  gap: 16px;
  align-items: center;
  justify-self: center;
  text-align: start;

  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
`

export const FeedbackText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.md};
  /* padding-left: 20px; */
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  align-self: flex-start;
`
export const Feedback = styled.p`
  white-space: pre-line;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`

export const FeedbackButton = styled.button`
  width: 80%;
  height: 40px;

  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};

  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`
export const BadgeSection = styled.div`
  justify-content: center;
`
export const AnimatedCardWrapper = styled.div`
  animation: ${slideRotateIn} 1.6s ease forwards;
  position: absolute; /* ✅ 수정 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* ✅ 중앙 정렬 */
  transform-origin: center center;
  z-index: 1000;
`
export const RouteSection = styled.div`
  align-self: center;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
  overflow: hidden;

  :last-child {
    margin-bottom: 10px;
  }
`

export const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  padding: 11px 20px;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
`

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
`

export const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
  }

  &:active {
    background-color: #eff9e8;
  }

  &:last-child {
    border-bottom: none;
  }
`

export const MenuText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.lfRed.base};
  font-size: ${({ theme }) => theme.fontSize.sm};
  padding: 4px 0;
`
