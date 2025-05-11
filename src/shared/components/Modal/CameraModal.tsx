'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'
import { ToastType } from '@shared/context/Toast/type'
import { useImageUpload } from '@shared/hooks/useImageUpload/useImageUpload'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

const CameraModal = () => {
  const { uploadFile } = useImageUpload()
  const openToast = useToast()
  const { isOpen, title, type, hasDescription, onComplete, close } = useCameraModalStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState<string>('')

  useEffect(() => {
    if (!isOpen || !videoRef.current) return

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    })

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | undefined
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [isOpen])

  const capture = () => {
    if (!canvasRef.current || !videoRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)

    /** S3 이미지 업로드 */
    canvasRef.current.toBlob(async blob => {
      if (!blob) return
      try {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
        const uploadedUrl = await uploadFile(file)
        setPreviewUrl(uploadedUrl)
      } catch (err) {
        openToast(ToastType.Error, '이미지 업로드 실패')
      }
    }, 'image/jpeg')
  }

  const handleConfirm = () => {
    if (!previewUrl) return
    if (hasDescription && !description) return

    onComplete({ imageUrl: previewUrl, description: hasDescription ? description : undefined })
    close()
    setPreviewUrl(null)
    setDescription('')
  }

  let content
  if (!previewUrl || (previewUrl && !hasDescription)) {
    content = (
      <ShootButtonWrapper onClick={capture}>
        <LucideIcon name='Camera' size={50} />
        <ShootText>촬영하기</ShootText>
      </ShootButtonWrapper>
    )
  } else if (hasDescription) {
    content = (
      <TextAreaWrapper>
        <TextAreaLabel type={type}>{type === 'SUCCESS' ? '성공 인증 이미지' : '실패 인증 이미지'}</TextAreaLabel>
        <TextAreaDescription>인증 참여 이미지를 사람들에게 설명해주세요.</TextAreaDescription>
        <TextArea value={description} onChange={e => setDescription(e.target.value)} placeholder='예) Placeholder' />
      </TextAreaWrapper>
    )
  }

  if (!isOpen) return null
  return (
    <Wrapper>
      <Header>{title}</Header>
      <CameraWrapper>
        {previewUrl ? <ImagePreview src={previewUrl} /> : <CameraView ref={videoRef} autoPlay playsInline />}
      </CameraWrapper>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <ContentWrapper>{content}</ContentWrapper>

      <SwitchWrapper>
        <ConfirmButton onClick={handleConfirm}>등록하기</ConfirmButton>
      </SwitchWrapper>
    </Wrapper>
  )
}

export default CameraModal

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.colors.lfInputBackground.base};
  z-index: 9999;
`

const Header = styled.div`
  width: 100%;
  height: 90px;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.medium};
  display: flex;
  align-items: center;
  justify-content: center;
`
const CameraWrapper = styled.div`
  gap: 16px;
  width: 100%;
  /* aspect-ratio: 1/1; */
  background-color: ${theme.colors.lfInputBackground.base};
`

const CameraView = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ContentWrapper = styled.div`
  width: 100%;
  height: 225px;
  padding: 12px 36px;

  position: relative;
  display: flex;
  flex-direction: column;

  background-color: ${theme.colors.lfInputBackground.base};
`
const ShootButtonWrapper = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  font-size: 24px;
  cursor: pointer;

  background-color: ${theme.colors.lfInputBackground.base};
`

const ShootText = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
`

const SwitchWrapper = styled.div`
  width: 80%;
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
`

const TextAreaWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`

const TextAreaLabel = styled.p<{ type: ChallengeVerificationStatusType | undefined }>`
  color: ${({ type }) => (type === 'SUCCESS' ? theme.colors.lfBlue.base : theme.colors.lfRed.base)};
  font-family: ${theme.fontWeight.semiBold};
  font-size: ${theme.fontSize.base};
`
const TextAreaDescription = styled.p`
  color: ${theme.colors.lfDarkGray};
  font-size: ${theme.fontSize.xs};

  margin: 10px 0 14px 0;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: 1px solid ${theme.colors.lfGray.base};
  border-radius: ${theme.radius.base};
  padding: 12px;
  font-size: ${theme.fontSize.xs};
  resize: none;
`

const ConfirmButton = styled.button`
  width: 100%;
  padding: 16px;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.medium};
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  border: none;
  border-radius: ${theme.radius.base};
  cursor: pointer;
`
