'use client'
import styled from '@emotion/styled'

import { useToastStore } from '@shared/context/Toast/ToastStore'
import { ToastType } from '@shared/context/Toast/type'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

const Toast = () => {
  const { isOpen, type, description, close: closeToast } = useToastStore()
  if (!isOpen || !description) return null

  const iconName = type === ToastType.Success ? 'CheckCheck' : 'CircleAlert'
  const color = type === ToastType.Success ? 'lfBlack' : 'lfRed'

  return (
    <Container toastType={type}>
      <Wrapper>
        <LucideIcon name={iconName} size={20} color={color} />
      </Wrapper>
      <Message>{description}</Message>
      <CloseIcon onClick={() => closeToast()}>
        <LucideIcon name='X' size={16} color='lfBlack' />
      </CloseIcon>
    </Container>
  )
}

export default Toast

/*-----스타일-------*/
const Container = styled.div<{ toastType: ToastType }>`
  position: fixed;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.02em;

  z-index: 100;
  left: 50%;
  transform: translateX(-50%);

  min-width: ${({ toastType }) => (toastType === ToastType.Success ? '209px' : '256px')};
  height: 30px;
  padding: 25px 20px;

  background-color: ${theme.colors.lfWhite.base};
  border-radius: ${theme.radius.base};
  color: ${({ toastType }) => (toastType === ToastType.Success ? theme.colors.lfBlack.base : theme.colors.lfRed.base)};

  font-size: ${({ toastType }) => (toastType === ToastType.Success ? theme.fontSize.sm : theme.fontSize.xs)};
  font-weight: ${theme.fontWeight.medium};
`
const Wrapper = styled.div`
  display: flex;
  align-self: center;
`

const Message = styled.span`
  flex: 1;
  white-space: pre-line;
`

const CloseIcon = styled.div`
  position: absolute;
  right: 7px;
  top: 4px;
  cursor: pointer;
`
