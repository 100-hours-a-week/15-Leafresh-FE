'use client'

import { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'
import { ToastType } from '@shared/context/Toast/type'
import { useImageUpload } from '@shared/hooks/useImageUpload/useImageUpload'
import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
import { useToast } from '@shared/hooks/useToast/useToast'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

import SwitchTap from '../../switchtap/SwitchTap'
import VerificationGuideModal from './VerificationGuideModal'

const CAMERA_TABS = ['카메라']
const CHALLENGE_TABS = ['카메라', '인증 방법']

type FacingMode = 'user' | 'environment'
const CameraModal = () => {
  const openToast = useToast()
  const { isOpen, title, challengeData, hasDescription, onComplete, close, status } = useCameraModalStore()
  const { uploadFile, loading: uploading, error: uploadError } = useImageUpload()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const TABS = !challengeData ? CAMERA_TABS : CHALLENGE_TABS
  const [tab, setTab] = useState<number>(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [description, setDescription] = useState<string>('')
  const [showGuide, setShowGuide] = useState<boolean>(false)
  const [scrollTop, setScrollTop] = useState<number>(0)

  const [facingMode, setFacingMode] = useState<FacingMode>('user')

  useEffect(() => {
    const startCamera = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        openToast(ToastType.Error, '해당 기기에서는 카메라를 사용할 수 없습니다.')
        return
      }

      try {
        // 👉 후면 카메라 요청 시 실제 존재하는지 확인
        if (facingMode === 'environment') {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const hasBackCamera = devices.some(
            device => device.kind === 'videoinput' && device.label.toLowerCase().includes('back'),
          )

          if (!hasBackCamera) {
            openToast(ToastType.Error, '해당 기기에서는 후면 카메라를 지원하지 않습니다.')
            setFacingMode('user')
            return
          }
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        openToast(ToastType.Error, '카메라 접근이 거부되었습니다.')
      }
    }

    const stopCamera = () => {
      const stream = videoRef.current?.srcObject as MediaStream | undefined
      stream?.getTracks().forEach(track => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }

    if (isOpen) {
      setScrollTop(window.scrollY)
      if (!previewUrl) {
        startCamera()
      }
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, previewUrl, facingMode])

  useEffect(() => {
    if (tab === 1 && challengeData) setShowGuide(true)
    else setShowGuide(false)
  }, [tab])

  // useScrollLock(isOpen)
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
        openToast(ToastType.Error, '이미지 업로드 실패')
      }
    }, 'image/jpeg')
  }

  const handleConfirm = async () => {
    if (!previewUrl) return
    if (hasDescription && !description) return

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
    setTab(0)
  }

  const confirmText: string = status === 'SUCCESS' || status === 'FAILURE' ? '등록하기' : '인증하기'

  let content
  if (!previewUrl || (previewUrl && !hasDescription)) {
    content = (
      <ShootWrapper type='button'>
        <ShootButtonWrapper onClick={capture}>
          <LucideIcon name='Camera' size={50} />
          <ShootText>촬영하기</ShootText>
        </ShootButtonWrapper>
        <CovertCameraButton
          name='SwitchCamera'
          size={40}
          strokeWidth={2}
          onClick={() => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))}
        />
      </ShootWrapper>
    )
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
      <TextAreaWrapper>
        <TextAreaLabel status={status}>{label}</TextAreaLabel>
        <TextAreaDescription>인증 참여 이미지를 사람들에게 설명해주세요.</TextAreaDescription>
        <TextArea value={description} onChange={e => setDescription(e.target.value)} placeholder='예) Placeholder' />
      </TextAreaWrapper>
    )
  }

  if (!isOpen) return null
  return (
    <Overlay>
      <Wrapper>
        <Header>
          {previewUrl ? (
            <BackButton name='ChevronLeft' size={30} onClick={handleRestart} color='lfWhite' />
          ) : (
            <CloseButton name='X' onClick={close} size={30} />
          )}
          {title}
        </Header>
        <CameraWrapper>
          {previewUrl ? <ImagePreview src={previewUrl} /> : <CameraView ref={videoRef} autoPlay playsInline />}
        </CameraWrapper>
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <ContentWrapper>{content}</ContentWrapper>

        <SwitchWrapper>
          {!previewUrl ? (
            <SwitchTap tabs={TABS} currentIndex={tab} onChange={handleTabChange} />
          ) : (
            <ConfirmButton onClick={handleConfirm}>{confirmText}</ConfirmButton>
          )}

          {challengeData && (
            <VerificationGuideModal isOpen={showGuide} challengeData={challengeData} onClose={() => setTab(0)} />
          )}
        </SwitchWrapper>
      </Wrapper>
    </Overlay>
  )
}

export default CameraModal
//백업용 이전 코드
// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import styled from '@emotion/styled'

// import { ChallengeVerificationStatusType } from '@entities/challenge/type'
// import { useCameraModalStore } from '@shared/context/modal/CameraModalStore'
// import { ToastType } from '@shared/context/Toast/type'
// import { useImageUpload } from '@shared/hooks/useImageUpload/useImageUpload'
// import { useScrollLock } from '@shared/hooks/useScrollLock/useScrollLock'
// import { useToast } from '@shared/hooks/useToast/useToast'
// import LucideIcon from '@shared/lib/ui/LucideIcon'
// import { theme } from '@shared/styles/theme'

// import SwitchTap from '../../switchtap/SwitchTap'
// import VerificationGuideModal from './VerificationGuideModal'

// const CAMERA_TABS = ['카메라']
// const CHALLENGE_TABS = ['카메라', '인증 방법']

// type FacingMode = 'user' | 'environment'

// const CameraModal = () => {
//   const openToast = useToast()
//   const { isOpen, title, challengeData, hasDescription, onComplete, close, status } = useCameraModalStore()
//   const { uploadFile, loading: uploading, error: uploadError } = useImageUpload()

//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   const TABS = !challengeData ? CAMERA_TABS : CHALLENGE_TABS
//   const [tab, setTab] = useState<number>(0)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)
//   const [description, setDescription] = useState<string>('')
//   const [showGuide, setShowGuide] = useState<boolean>(false)
//   const [scrollTop, setScrollTop] = useState<number>(0)
//   const [facingMode, setFacingMode] = useState<FacingMode>('user')

//   const stopCamera = () => {
//     const stream = videoRef.current?.srcObject as MediaStream | undefined
//     stream?.getTracks().forEach(track => track.stop())
//     if (videoRef.current) {
//       videoRef.current.srcObject = null
//     }
//   }

//   const startCamera = async () => {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       openToast(ToastType.Error, '해당 기기에서는 카메라를 사용할 수 없습니다.')
//       return
//     }

//     try {
//       if (facingMode === 'environment') {
//         const devices = await navigator.mediaDevices.enumerateDevices()
//         const hasBackCamera = devices.some(
//           device => device.kind === 'videoinput' && device.label.toLowerCase().includes('back'),
//         )
//         if (!hasBackCamera) {
//           openToast(ToastType.Error, '해당 기기에서는 후면 카메라를 지원하지 않습니다.')
//           setFacingMode('user')
//           return
//         }
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } })

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream

//         // 🔥 중요한 한 줄 추가: 영상이 로드될 때까지 기다림
//         await new Promise(resolve => {
//           videoRef.current!.onloadedmetadata = () => resolve(true)
//         })

//         videoRef.current.play()
//       }
//     } catch (error) {
//       openToast(ToastType.Error, '카메라 접근이 거부되었습니다.')
//     }
//   }

//   useEffect(() => {
//     if (isOpen && !previewUrl) {
//       // setScrollTop(window.scrollY)
//       startCamera()
//     }
//     return () => stopCamera()
//   }, [isOpen, previewUrl, facingMode])

//   useEffect(() => {
//     setShowGuide(tab === 1 && !!challengeData)
//   }, [tab])

//   useScrollLock(isOpen && !previewUrl)

//   const capture = () => {
//     if (!canvasRef.current || !videoRef.current) return
//     const ctx = canvasRef.current.getContext('2d')
//     if (!ctx) return
//     canvasRef.current.width = videoRef.current.videoWidth
//     canvasRef.current.height = videoRef.current.videoHeight
//     ctx.drawImage(videoRef.current, 0, 0)

//     canvasRef.current.toBlob(async blob => {
//       if (!blob) return
//       try {
//         const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
//         const uploadedUrl = await uploadFile(file)
//         setPreviewUrl(uploadedUrl)
//       } catch (err) {
//         openToast(ToastType.Error, '이미지 업로드 실패')
//       }
//     }, 'image/jpeg')
//   }

//   const handleConfirm = async () => {
//     if (!previewUrl) return
//     if (hasDescription && !description) return

//     try {
//       const blob = await (await fetch(previewUrl)).blob()
//       const file = new File([blob], 'capture.jpg', { type: blob.type })
//       const fileUrl = await uploadFile(file)

//       onComplete({ imageUrl: fileUrl, description: hasDescription ? description : undefined })
//     } catch (err) {
//       console.error('이미지 업로드 실패', uploadError)
//     } finally {
//       close()
//       stopCamera()
//       setPreviewUrl(null)
//       setDescription('')
//     }
//   }

//   const handleTabChange = (clickedTab: number) => {
//     if (challengeData && clickedTab !== tab) setTab(clickedTab)
//   }

//   const handleRestart = () => {
//     setPreviewUrl(null)
//     setDescription('')
//     setTab(0)
//     startCamera()
//   }

//   const confirmText: string = status === 'SUCCESS' || status === 'FAILURE' ? '등록하기' : '인증하기'

//   if (!isOpen) return null

//   return (
//     <Overlay>
//       <Wrapper>
//         <Header>
//           {previewUrl ? (
//             <BackButton name='ChevronLeft' size={30} onClick={handleRestart} color='lfWhite' />
//           ) : (
//             <CloseButton
//               name='X'
//               onClick={() => {
//                 close()
//                 stopCamera()
//               }}
//               size={30}
//             />
//           )}
//           {title}
//         </Header>
//         <CameraWrapper>
//           {previewUrl ? <ImagePreview src={previewUrl} /> : <CameraView ref={videoRef} autoPlay playsInline />}
//         </CameraWrapper>
//         <canvas ref={canvasRef} style={{ display: 'none' }} />

//         <ContentWrapper>
//           {!previewUrl || (previewUrl && !hasDescription) ? (
//             <ShootWrapper type='button'>
//               <ShootButtonWrapper onClick={capture}>
//                 <LucideIcon name='Camera' size={50} />
//                 <ShootText>촬영하기</ShootText>
//               </ShootButtonWrapper>
//               <CovertCameraButton
//                 name='SwitchCamera'
//                 size={40}
//                 strokeWidth={2}
//                 onClick={() => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))}
//               />
//             </ShootWrapper>
//           ) : (
//             <TextAreaWrapper>
//               <TextAreaLabel status={status}>
//                 {status === 'SUCCESS'
//                   ? '성공 인증 이미지'
//                   : status === 'FAILURE'
//                     ? '실패 인증 이미지'
//                     : '인증 이미지 설명'}
//               </TextAreaLabel>
//               <TextAreaDescription>인증 참여 이미지를 사람들에게 설명해주세요.</TextAreaDescription>
//               <TextArea
//                 value={description}
//                 onChange={e => setDescription(e.target.value)}
//                 placeholder='예) Placeholder'
//               />
//             </TextAreaWrapper>
//           )}
//         </ContentWrapper>

//         <SwitchWrapper>
//           {!previewUrl ? (
//             <SwitchTap tabs={TABS} currentIndex={tab} onChange={handleTabChange} />
//           ) : (
//             <ConfirmButton onClick={handleConfirm}>{confirmText}</ConfirmButton>
//           )}

//           {challengeData && (
//             <VerificationGuideModal isOpen={showGuide} challengeData={challengeData} onClose={() => setTab(0)} />
//           )}
//         </SwitchWrapper>
//       </Wrapper>
//     </Overlay>
//   )
// }

// export default CameraModal

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;

  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px);
  z-index: 199;
`

const Wrapper = styled.div`
  position: fixed;
  top: 0%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 320px;
  max-width: 500px;
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${theme.colors.lfInputBackground.base};
  z-index: 200;
`

const Header = styled.div`
  width: 100%;
  height: 90px;
  background-color: ${theme.colors.lfGreenMain.base};
  color: ${theme.colors.lfWhite.base};
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.medium};

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const BackButton = styled(LucideIcon)`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
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
  height: 250px;
  padding: 18px 36px 0px 36px;

  position: relative;
  display: flex;
  flex-direction: column;

  background-color: ${theme.colors.lfInputBackground.base};
`
const ShootWrapper = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  font-size: 24px;
  cursor: pointer;

  /* position: relative; */

  background-color: ${theme.colors.lfInputBackground.base};
`

const ShootText = styled.span`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semiBold};
`

const SwitchWrapper = styled.div`
  width: 100%;
  flex: 1;
  padding: 12px 36px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const TextAreaWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`

const TextAreaLabel = styled.p<{ status: ChallengeVerificationStatusType | undefined }>`
  color: ${({ status }) =>
    status === 'SUCCESS'
      ? theme.colors.lfBlue.base
      : status === 'FAILURE'
        ? theme.colors.lfRed.base
        : theme.colors.lfBlack.base};
  font-weight: ${theme.fontWeight.semiBold};
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

const CloseButton = styled(LucideIcon)`
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
`

const ShootButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CovertCameraButton = styled(LucideIcon)`
  position: absolute;
  right: 25px;
`
