import Image from 'next/image'

import { ImageZoomModalData, useImageZoomStore } from '@shared/context/zoom-modal/ImageZoomStore'

interface ZoomableImageProps {
  src: string
  alt: string
  width: number
  height: number

  verificationData: ImageZoomModalData[]
  targetIndex: number
}
const ZoomableImage = ({ src, alt, width, height, verificationData, targetIndex }: ZoomableImageProps) => {
  const { open } = useImageZoomStore()

  /** 이미지 확대 모달 열기 */
  const handleOpenImageModal = () => {
    open(verificationData, targetIndex)
  }
  return (
    <div onClick={handleOpenImageModal}>
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  )
}

export default ZoomableImage
