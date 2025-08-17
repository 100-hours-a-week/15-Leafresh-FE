import styled from '@emotion/styled'

import { LogoCharacterImage } from '@/shared/assets'

export const EmptyWrapper = styled.div`
  width: 100%;
  flex: 1; // height 대신 부모 기준으로 확장
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

export const NoContentImage = styled(LogoCharacterImage)`
  align-self: center;
  display: flex;
`

export const NoChallengeMessage = styled.div`
  margin-top: 10px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  white-space: pre-line;
  text-align: center;
`

export const CreateButton = styled.button`
  width: 60%;
  max-width: 320px;
  padding: 16px 32px;

  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  box-shadow: ${({ theme }) => theme.shadow.lfInput};
  color: ${({ theme }) => theme.colors.lfWhite.base};

  border: none;
  border-radius: ${({ theme }) => theme.radius.base};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
`
