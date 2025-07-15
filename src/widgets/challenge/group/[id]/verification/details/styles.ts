import Image from 'next/image'

import styled from '@emotion/styled'

import { ASPECT_RATIO } from '@/shared/constants'
import { responsiveHorizontalPadding } from '@/shared/styles'

export const Container = styled.div`
  width: 100%;
  ${responsiveHorizontalPadding}
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
`

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`

export const ProfileCircle = styled(Image)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Nickname = styled.div`
  font-size: 14px;
  font-weight: bold;
`

export const Time = styled.div`
  font-size: 12px;
  color: #888;
`

export const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: ${ASPECT_RATIO.CHALLENGE.VERIFICATION};
  border-radius: ${({ theme }) => theme.radius.md};

  position: relative;
  overflow: hidden;
`

export const ContentImage = styled(Image)`
  position: relative;
  object-fit: cover;
  object-position: center;
`

export const Content = styled.p`
  padding: 16px 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.lfBlack.base};
`

export const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 10px 0;
  font-size: ${({ theme }) => theme.fontSize.base};
`

export const LeftStat = styled.div`
  display: flex;
  gap: 16px;
`

export const Stat = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  gap: 4px;
`

export const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.lfBlack.base};
  cursor: pointer;
`

export const LikeIconImage = styled(Image)`
  height: 16px;
  width: auto;
`
