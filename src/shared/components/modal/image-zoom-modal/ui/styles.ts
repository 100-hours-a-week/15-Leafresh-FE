import { X } from 'lucide-react'
import Image from 'next/image'

import { ChallengeVerificationResultType } from '@entities/challenge/model'

import styled from '@emotion/styled'

export const Wrapper = styled.div`
  position: absolute;
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  height: 100dvh;
  top: 0;
  z-index: 300;
  display: flex;
  flex-direction: column;
  background-color: black;
`

export const Header = styled.div`
  padding: 24px 0;

  font-size: 14px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  position: relative;

  span {
    font-size: ${({ theme }) => theme.fontSize.base};
  }
`

export const CloseIcon = styled(X)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`

export const ResultBar = styled.div<{ result: ChallengeVerificationResultType }>`
  background-color: ${({ result }) => (result === 'SUCCESS' ? '#2e7d32' : '#c62828')};
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${({ theme }) => theme.fontSize.lg};
  padding: 12px 0;
`

export const Viewport = styled.div`
  width: 100%;
  overflow: hidden;

  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  background-color: black;
  flex: 1;
`

export const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  &.animate {
    transition: transform 0.3s ease;
  }
`
export const Slide = styled.div`
  position: relative;
  flex: 0 0 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ImageArea = styled.div`
  width: 100%; // 슬라이드 전체 너비
  aspect-ratio: 1 / 1; // 정사각형 유지

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

export const StyledImage = styled(Image)`
  object-fit: cover;
`

export const Description = styled.div`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.base};
  background-color: black;
  color: #fff;
  padding: 30px 20px;
`
