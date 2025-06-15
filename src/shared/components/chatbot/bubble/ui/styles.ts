import styled from '@emotion/styled'

export const Container = styled.div<{ role: 'bot' | 'user' }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ role }) => (role === 'bot' ? 'flex-start' : 'flex-end')};
  gap: 8px;
`

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  order: ${({ role }) => (role === 'user' ? 1 : 0)};
`

export const BubbleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 260px;
`

export const NameText = styled.p<{ role: 'bot' | 'user' }>`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  margin: 8px 0 0 0;
`

export const Bubble = styled.div<{ role: 'bot' | 'user'; isAnswer?: boolean }>`
  max-width: 250px;
  min-width: 60px;
  padding: 16px 12px;
  line-height: 0.8rem;
  background: ${({ role, isAnswer, theme }) =>
    isAnswer ? theme.colors.lfWhite.base : role === 'bot' ? '#AFF9BB' : theme.colors.lfWhite.base};
  color: ${({ role, theme }) => (role === 'bot' ? '#333333' : theme.colors.lfBlack.base)};
  border: ${({ isAnswer, theme }) => (isAnswer ? `solid 1px ${theme.colors.lfGreenBorder.base}` : 'none')};
  justify-content: center;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  white-space: pre-wrap;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
`

export const SubDescription = styled.div<{ role: 'bot' | 'user' }>`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.lfGreenMain.base};
  text-align: center;
  margin-bottom: 10px;
  white-space: pre-wrap;
  line-height: 1.4;
  max-width: 235px;
`

export const RetryButton = styled.button`
  width: 164px;
  height: 37px;
  align-self: center;
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border: none;
  border-radius: 10px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  margin-top: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  }
`
