import { responsiveHorizontalPadding } from '@shared/styles/responsive-style'

import styled from '@emotion/styled'

export const Wrapper = styled.div`
  ${responsiveHorizontalPadding};
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: 20px;
`

export const AlarmList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const AlarmCard = styled.div`
  display: flex;
  gap: 12px;
  background: ${({ theme }) => theme.colors.lfWhite.base};
  border: solid 1px ${({ theme }) => theme.colors.lfGreenBorder.base};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
`

export const AlarmImage = styled.img`
  width: 62px;
  height: 62px;
  object-fit: cover;
  border: solid 1px ${({ theme }) => theme.colors.lfGreenBorder.base};
  border-radius: ${({ theme }) => theme.radius.full};
`

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 4px;
`

export const AlarmTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 한 줄 말줄임 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

export const AlarmDesc = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 두 줄 말줄임 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`

export const CreatedAt = styled.div`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.fontSize.xs};
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.lfDarkGray.base};
`

export const Observer = styled.div`
  height: 1px;
`

export const NoAlarmText = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.lfRed.base};
`
