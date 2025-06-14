'use client'

import { ChallengeVerificationStatusType } from '@entities/challenge/model'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { ThemeColorType } from '@shared/styles/theme/type'

import { VerificationImageInputProps } from '../model/types'
import * as S from './styles'

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
    <S.Container className={className}>
      <S.ImageArea>
        <S.StyledImageInput
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
          <S.ZoomButton type='button' onClick={onZoom}>
            <LucideIcon name='Scan' size={24} color='lfWhite' />
          </S.ZoomButton>
        )}
      </S.ImageArea>

      <S.Footer backgroundColor={color}>{icon}</S.Footer>
      {imageUrl && <S.Description>{description}</S.Description>}
    </S.Container>
  )
}

export default VerificationImageInput
