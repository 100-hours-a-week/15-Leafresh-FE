'use client'

import ImageInput from '@shared/components/image-input'
import LucideIcon from '@shared/lib/ui/LucideIcon'

const MainPage = () => {
  return (
    <ImageInput
      icon={<LucideIcon name='Camera' />}
      label={`인증 성공 예시\n이미지 추가`}
      cameraTitle='친환경 챌린지'
      // hasDescription
      // type='FAILURE'
    />
  )
}
export default MainPage
