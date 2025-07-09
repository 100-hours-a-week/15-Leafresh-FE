'use client'

import { useEffect, useRef, useState } from 'react'

import { CheckIcon, ErrorText, LucideIcon, SwitchTap, VerificationGuideModal } from '@/shared/components'
import { useCameraModalStore } from '@/shared/context'
import { useUploadImageToBucket, useScrollLock, useToast } from '@/shared/hooks'

import * as S from './styles'

const CAMERA_TABS = ['카메라']
const CHALLENGE_TABS = ['카메라', '인증 방법']

type FacingMode = 'user' | 'environment'
export const CameraModal = () => {
  const { toast } = useToast()
  const { isOpen, title, challengeData, hasDescription, onComplete, close, status } = useCameraModalStore()

  const { uploadFile, loading: uploading, error: uploadError } = useUploadImageToBucket()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null) // 스트림 참조를 저장할 ref 추가

  const TABS = !challengeData ? CAMERA_TABS : CHALLENGE_TABS
  const [tab, setTab] = useState<number>(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState<string>('')
  const [showGuide, setShowGuide] = useState<boolean>(false)
  const [scrollTop, setScrollTop] = useState<number>(0)
  const [errorText, setErrorText] = useState<string | undefined>(undefined)

  const [facingMode, setFacingMode] = useState<FacingMode>('environment')

  // 카메라 정리 함수를 분리하여 관리
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startCamera = async (mode: FacingMode = facingMode) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast('Error', '해당 기기에서는 카메라를 사용할 수 없습니다.')
      close()
      return
    }

    // 기존 카메라가 있다면 먼저 정리
    stopCamera()

    try {
      // facingMode를 직접 전달하고 후면 카메라 감지 로직 개선
      const constraints = {
        video: { facingMode: mode },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream // 스트림 참조 저장

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      if (mode === 'environment') {
        toast('Error', '해당 방향을 지원하지 않습니다!')
      } else {
        toast('Error', '잠시만 기다려주세요.')
      }

      /** 후면 카메라 미지원시 */
      if (mode === 'environment') {
        setFacingMode('user')
      }
    }
  }

  // 카메라 초기화 및 정리 효과
  useEffect(() => {
    if (isOpen && !previewUrl) {
      setScrollTop(window.scrollY)
      startCamera()
    }

    return () => {
      // 컴포넌트 언마운트 또는 의존성 변경 시 항상 카메라 정리
      stopCamera()
    }
  }, [isOpen, previewUrl, facingMode])

  useEffect(() => {
    if (tab === 1 && challengeData) setShowGuide(true)
    else setShowGuide(false)
  }, [tab])

  useScrollLock(isOpen && !previewUrl)

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
        toast('Error', '이미지 업로드 실패')
      }
    }, 'image/jpeg')
  }

  const handleConfirm = async () => {
    if (!previewUrl) return
    if (hasDescription && !description) {
      setErrorText('설명은 필수입니다.')
      return
    }

    try {
      // 1) Base64 → Blob → File
      const blob = await (await fetch(previewUrl)).blob()
      const file = new File([blob], 'capture.jpg', { type: blob.type })

      // 2) GCS 업로드 & fileUrl 획득
      const fileUrl = await uploadFile(file)

      // 3) onComplete으로 최종 URL과 설명 전달
      onComplete({
        imageUrl: fileUrl,
        description: hasDescription ? description : undefined,
      })
    } catch (err) {
      console.error('이미지 업로드 실패', uploadError)
    } finally {
      // 모달 닫기 및 초기화
      close()
      setPreviewUrl(null)
      setDescription('')
      setErrorText(undefined)
    }
  }

  const handleTabChange = (clickedTab: number) => {
    /** 챌린지 데이터가 있는 경우에만 tab 번호 바뀜 */
    if (challengeData && clickedTab != tab) {
      setTab(prev => (prev === 1 ? 0 : 1))
    }
  }

  /** 이미지 삭제하기 */
  const handleRestart = () => {
    setPreviewUrl(null)
    setDescription('')
    setErrorText(undefined)
    setTab(0)
  }

  const confirmText: string = status === 'SUCCESS' || status === 'FAILURE' ? '등록하기' : '인증하기'

  let content
  if (!previewUrl || (previewUrl && !hasDescription)) {
    // 촬영 후
    if (previewUrl) {
      content = (
        <S.ShootWrapper type='button'>
          <S.ShootButtonWrapper onClick={capture}>
            <CheckIcon />
          </S.ShootButtonWrapper>
        </S.ShootWrapper>
      )
    }
    // 촬영 전
    else {
      content = (
        <S.ShootWrapper type='button'>
          <S.ShootButtonWrapper onClick={capture}>
            <LucideIcon name='Camera' size={50} />
            <S.ShootText>촬영하기</S.ShootText>
          </S.ShootButtonWrapper>
          <S.CovertCameraButton
            name='SwitchCamera'
            size={40}
            strokeWidth={2}
            onClick={() => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))}
          />
        </S.ShootWrapper>
      )
    }
  } else if (hasDescription) {
    let label
    switch (status) {
      case 'SUCCESS':
        label = '성공 인증 이미지'
        break
      case 'FAILURE':
        label = '실패 인증 이미지'
        break
      default:
        label = '인증 이미지 설명'
        break
    }
    content = (
      <S.TextAreaWrapper>
        <S.TextAreaLabel status={status}>{label}</S.TextAreaLabel>
        <S.TextAreaDescription>인증 참여 이미지를 사람들에게 설명해주세요.</S.TextAreaDescription>
        <S.TextArea value={description} onChange={e => setDescription(e.target.value)} placeholder='예) Placeholder' />
        <ErrorText message={errorText} />
      </S.TextAreaWrapper>
    )
  }

  if (!isOpen) return null
  return (
    <S.Overlay>
      <S.Wrapper>
        <S.Header>
          {previewUrl ? (
            <S.BackButton name='ChevronLeft' size={30} onClick={handleRestart} color='lfWhite' />
          ) : (
            <S.CloseButton name='X' onClick={close} size={30} />
          )}
          <S.Title>{title}</S.Title>
        </S.Header>
        <S.CameraWrapper>
          {previewUrl ? (
            <S.ImagePreview src={previewUrl} alt='촬영된 이미지' fill />
          ) : (
            <S.CameraView ref={videoRef} autoPlay playsInline />
          )}
        </S.CameraWrapper>
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <S.ContentWrapper>{content}</S.ContentWrapper>

        <S.SwitchWrapper>
          {!previewUrl ? (
            <SwitchTap tabs={TABS} currentIndex={tab} onChange={handleTabChange} />
          ) : (
            <S.ConfirmButton onClick={handleConfirm}>{confirmText}</S.ConfirmButton>
          )}

          {challengeData && (
            <VerificationGuideModal isOpen={showGuide} challengeData={challengeData} onClose={() => setTab(0)} />
          )}
        </S.SwitchWrapper>
      </S.Wrapper>
    </S.Overlay>
  )
}
