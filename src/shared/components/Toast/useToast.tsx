'use client'
import { ReactNode } from 'react';

import styled from '@emotion/styled'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'

export interface ToastProps {
    isSuccess: boolean
    message: string
    onClose?: () => void
  }

const Component = ({ isSuccess, message, onClose }: ToastProps): ReactNode => {
  const iconName = isSuccess ? 'CheckCheck' : 'CircleAlert'

  return (
    <Container success={isSuccess}>
      <Wrapper>
        <LucideIcon
          name={iconName}
          size={20}
          color={isSuccess ? 'lfBlack' : 'lfRed'}
        />
      </Wrapper>
      <Message>{message}</Message>
      {onClose && (
        <CloseIcon onClick={onClose}>
          <LucideIcon name="X" size={16} color="lfBlack" />
        </CloseIcon>
      )}
    </Container>
  );
};

export default Component;

/*-----스타일-------*/
const Container = styled.div<{ success: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.02em;
  
  z-index: 100;
  left: 50%;
  transform: translateX(-50%);

  min-width: ${({success}) => success
    ? '209px'
    : '256px'
  };
  height: 30px;
  padding: 25px 20px;

  background-color: ${theme.colors.lfWhite.base};
  /* border: 1px solid
    ${({ success }) => success
      ? theme.colors.lfGreenMain.base
      : theme.colors.lfRed.base
    }; */
  border-radius: ${theme.radius.base};
  color: ${({ success }) =>
    success
      ? theme.colors.lfBlack.base
      : theme.colors.lfRed.base};
  font-size: ${({success}) => success
    ? theme.fontSize.sm
    : theme.fontSize.xs
  };
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