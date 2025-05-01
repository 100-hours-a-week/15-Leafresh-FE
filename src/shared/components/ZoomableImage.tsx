import Image from 'next/image'

import { ImageZoomData, useImageZoomStore } from '@shared/context/ImageZoomState'

interface ZoomableImageProps {
  src: string
  alt: string
  width: number
  height: number

  verificationData: ImageZoomData[]
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
