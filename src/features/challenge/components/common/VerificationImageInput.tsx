'use client'

import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@entities/challenge/type'
import ImageInput from '@shared/components/image-input/ui/image-input'
import LucideIcon from '@shared/components/lucide-icon/ui/lucide-icon'
import { theme } from '@shared/styles/theme'
import { ThemeColorType } from '@shared/styles/theme/type'
import { getThemeColor } from '@shared/styles/theme/utils'

const STATUS_ICON_MAP: Record<ChallengeVerificationStatusType, { icon: React.ReactNode; color: ThemeColorType }> = {
  SUCCESS: {
    icon: <LucideIcon name='Check' size={20} color='lfWhite' />,
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
  onChange: (data: { imageUrl: string | null; description?: string | null }) => void
  onZoom: () => void
  readOnly?: boolean
  className?: string
}

const VerificationImageInput = ({
  label,
  description,
  status,
  imageUrl,
  cameraTitle,
  onChange,
  onZoom,
  readOnly = false,
  className,
}: VerificationImageInputProps) => {
  const { icon, color } = STATUS_ICON_MAP[status]

  return (
    <Container className={className}>
      <ImageArea>
        <StyledImageInput
          icon={<LucideIcon name='Camera' size={24} color='lfDarkGray' />}
          label={label}
          backgroundColor='lfInputBackground'
          imageUrl={imageUrl}
          cameraTitle={cameraTitle}
          hasDescription
          type={status}
          onChange={readOnly ? () => {} : onChange}
          readOnly={readOnly}
        />
        {imageUrl && (
          <ZoomButton type='button' onClick={onZoom}>
            <LucideIcon name='Scan' size={24} color='lfWhite' />
          </ZoomButton>
        )}
      </ImageArea>

      <Footer backgroundColor={color}>{icon}</Footer>
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
  flex-shrink: 0;
`

const ImageArea = styled.div`
  position: relative;
  width: 100%;
`

const StyledImageInput = styled(ImageInput)`
  width: 100%;
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
  margin-top: 8px;
  line-height: 130%;
  word-break: break-word;
  white-space: pre-wrap;
`
const ZoomButton = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`
