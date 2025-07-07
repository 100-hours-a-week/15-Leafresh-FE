'use client'

import styled from '@emotion/styled'

import { ChallengeVerificationStatusType } from '@/entities/challenge/model'

import { ImageInput, LucideIcon } from '@/shared/components'
import { theme, ThemeColorType } from '@/shared/config'
import { getThemeColor } from '@/shared/lib'

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

export const VerificationImageInput = ({
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
      <StyledImageInput
        icon={<LucideIcon name='Camera' size={24} color='lfDarkGray' />}
        label={label}
        backgroundColor='lfInputBackground'
        imageUrl={imageUrl}
        cameraTitle={cameraTitle}
        hasDescription
        type={status}
        onChange={readOnly ? () => {} : onChange}
        onZoom={onZoom}
        readOnly={readOnly}
      />

      <Footer backgroundColor={color}>{icon}</Footer>
      {imageUrl && <Description>{description}</Description>}
    </Container>
  )
}

// === Styles ===
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  flex-shrink: 0;
`

const StyledImageInput = styled(ImageInput)`
  width: 100%;

  position: relative;

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
