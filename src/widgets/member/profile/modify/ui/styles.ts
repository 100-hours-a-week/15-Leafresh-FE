import ErrorText from '@shared/components/errortext'

import styled from '@emotion/styled'

export const Container = styled.div`
  max-width: 24rem;
  margin: 0 auto;
  background-color: #fff;
  min-height: 100vh;
`

export const Header = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lfLightGray.base};
`

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: #111827;
`

export const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`

export const UploadImageButton = styled.label<{ $hasImage: boolean }>`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: ${({ $hasImage }) => ($hasImage ? 'transparent' : '#fff')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fcfcfc;
`

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

export const CameraWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 0px;
  gap: 3px;
  padding: 5px 5px;

  background-color: ${({ theme }) => theme.colors.lfWhite.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  border: 1px solid #3d444d;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`

export const HiddenInput = styled.input`
  display: none;
`

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
`

export const TextInput = styled.input`
  width: 100%;
  padding: 0.5rem 0;
  background: transparent;
  border: 0;
  border-bottom: 1px solid #d1d5db;
  color: #111827;
  font-size: 1rem;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    outline: none;
    border-color: #6b7280;
  }
`

export const InputMeta = styled.div<{ hasError: boolean }>`
  display: flex;

  justify-content: ${({ hasError }) => (hasError ? 'space-between' : 'flex-end')};
  align-items: center;
  margin-top: 0.25rem;
  font-size: 0.875rem;
`

export const CountText = styled.span<{ hasError: boolean }>`
  color: ${({ hasError, theme }) => (hasError ? theme.colors.lfRed.base : theme.colors.lfBlack.base)};
  font-size: ${({ theme }) => theme.fontSize.sm};
`

export const SubmitButton = styled.button<{ disabled: boolean }>`
  margin-top: 20px;
  width: 100%;
  padding: 10px 0;
  background-color: ${({ disabled }) =>
    disabled ? `$({theme}){=>theme.colors.lfGreenInactive.base}` : `$({theme}){=>theme.colors.lfGreenMain.base}`};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.lfPrime};
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  :hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.lfGreenMain.hover};
  }
`

export const StyledErrorText = styled(ErrorText)`
  margin: 0;
`
