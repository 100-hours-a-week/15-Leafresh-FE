'use client'

import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import ImageInput from '@shared/components/image-input'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import { ThemeColorType } from '@shared/styles/theme/type'
import { getThemeColor } from '@shared/styles/theme/utils'

const STATUS_ICON_MAP: Record<ChallengeVerificationStatusType, { icon: React.ReactNode; color: ThemeColorType }> = {
  SUCCESS: {
    icon: <LucideIcon name='Check' size={20} color='lfWhite' />, // icon은 white로
    color: 'lfGreenMain',
  },
  FAILURE: {
    icon: <LucideIcon name='X' size={20} color='lfWhite' />,
    color: 'lfRed',
  },
  PENDING_APPROVAL: {
    icon: <LucideIcon name='Clock' size={20} color='lfWhite' />,
    color: 'lfGray',
  },
  NOT_SUBMITTED: {
    icon: <LucideIcon name='Plus' size={20} color='lfWhite' />,
    color: 'lfGray',
  },
  DONE: {
    icon: <LucideIcon name='Plus' size={20} color='lfWhite' />,
    color: 'lfGray',
  },
}

interface VerificationImageInputProps {
  label: string
  status: ChallengeVerificationStatusType
  imageUrl: string | null
  description: string | null

  cameraTitle: string

  onImageChange: (imageUrl: string | null) => void
  onDescriptionChange: (description: string | null) => void

  onZoomClick?: () => void
  className?: string
}

const VerificationImageInput = ({
  label,
  description,
  status,
  imageUrl,
  cameraTitle,
  onImageChange,
  onDescriptionChange,
  onZoomClick,
  className,
}: VerificationImageInputProps) => {
  const { icon, color } = STATUS_ICON_MAP[status]

  return (
    <Container className={className}>
      <StyledImageInput
        icon={<LucideIcon name='Camera' size={24} color='lfDarkGray' />}
        label={label}
        backgroundColor='lfInputBackground'
        imageUrl={imageUrl}
        cameraTitle={cameraTitle}
        hasDescription
        type={status}
        onImageChange={onImageChange}
        onDescriptionChange={onDescriptionChange}
      />

      {/* 하단 상태 표시 영역 */}
      <Footer backgroundColor={color}>{icon}</Footer>

      {/* 우하단 확대 버튼 */}
      {imageUrl && (
        <ZoomButton onClick={onZoomClick}>
          <LucideIcon name='Scan' size={20} />
        </ZoomButton>
      )}

      {/* 설명 텍스트 */}
      {imageUrl && <Description>{description}</Description>}
    </Container>
  )
}

export default VerificationImageInput

// === Styles ===
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
`
const StyledImageInput = styled(ImageInput)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`

const Footer = styled.div<{ backgroundColor: ThemeColorType }>`
  width: 100%;
  height: 28px;
  border-bottom-left-radius: ${theme.radius.md};
  border-bottom-right-radius: ${theme.radius.md};
  background-color: ${({ backgroundColor }) => getThemeColor(backgroundColor)};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Description = styled.p`
  font-size: ${theme.fontSize.xs};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.lfBlack.base};
  text-align: center;
  margin-top: 6px;
`

const ZoomButton = styled.button`
  position: absolute;
  bottom: 60px;
  right: 2px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`
