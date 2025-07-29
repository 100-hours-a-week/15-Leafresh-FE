import Image from 'next/image'

import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import { LucideIcon } from '@/shared/components'

import { FacingMode } from './types'

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px);
  z-index: 199;
`

export const Wrapper = styled.div`
  position: fixed;
  top: 0%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  height: 100dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // ✅ iOS 부드러운 스크롤

  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
  z-index: 200;
`

export const Header = styled.div`
  width: 100%;
  padding: 20px 0px;

  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`

export const BackButton = styled(LucideIcon)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
`

export const CameraWrapper = styled.div`
  gap: 16px;
  width: 100%;
  aspect-ratio: 1/1;
  /* overflow: hidden; */

  position: relative;
  background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
`

export const CameraView = styled.video<{ facingMode: FacingMode }>`
  height: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;

  transform: ${({ facingMode }) => (facingMode === 'environment' ? 'scaleX(-1)' : 'scaleX(1)')};
`

export const ImagePreview = styled(Image)`
  object-position: center;
  object-fit: cover;
`

export const ContentWrapper = styled.div`
  width: 100%;
  height: 150px;
  padding: 18px 36px 0px 36px;

  position: relative;
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
`
export const ShootWrapper = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  font-size: 24px;
  cursor: pointer;

  /* position: relative; */

  background-color: ${({ theme }) => theme.colors.lfInputBackground.base};
`

export const ShootText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
`

export const SwitchWrapper = styled.div`
  width: 100%;
  flex: 1;
  padding: 12px 36px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

export const TextAreaWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`

export const TextAreaLabel = styled.p<{ status: ChallengeVerificationStatusType | undefined }>`
  color: ${({ status, theme }) =>
    status === 'SUCCESS'
      ? theme.colors.lfBlue.base
      : status === 'FAILURE'
        ? theme.colors.lfRed.base
        : theme.colors.lfBlack.base};
  font-weight: ${({ theme }) => theme.fontWeight.semiBold};
  font-size: ${({ theme }) => theme.fontSize.base};
`
export const TextAreaDescription = styled.p`
  color: ${({ theme }) => theme.colors.lfDarkGray};
  font-size: ${({ theme }) => theme.fontSize.xs};

  margin: 10px 0 14px 0;
`

export const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.lfGray.base};
  border-radius: ${({ theme }) => theme.radius.base};
  padding: 12px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  resize: none;
`

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 16px;
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  background-color: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: ${({ theme }) => theme.colors.lfWhite.base};
  border: none;
  border-radius: ${({ theme }) => theme.radius.base};
  cursor: pointer;
`

export const CloseButton = styled(LucideIcon)`
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
`

export const Title = styled.span`
  width: 80%;

  text-align: center;
  white-space: nowrap; // 줄바꿈 방지
  overflow: hidden; // 넘치는 텍스트 숨김
  text-overflow: ellipsis; // 말줄임표 표시
`

export const ShootButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

export const CovertCameraButton = styled(LucideIcon)`
  position: absolute;
  right: 25px;
`
