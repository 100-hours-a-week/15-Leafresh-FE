import Image from 'next/image'

import styled from '@emotion/styled'

export const CommentItemWrapper = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 0;
`

export const Avatar = styled(Image)`
  width: 32px;
  height: 32px;
  background: #ddd;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ContentArea = styled.div`
  flex: 1;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
`

export const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

export const Meta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #888;
`

export const Nickname = styled.span`
  font-weight: 600;
`

export const Time = styled.span``

export const Controls = styled.div`
  display: flex;
  gap: 6px;
`

export const EditButton = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.lfBlue.base};
  background: none;
  border: none;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.colors.lfBlue.hover};
  }
`
export const DeleteButton = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.lfRed.base};
  background: none;
  border: none;
  cursor: pointer;
  :hover {
    color: ${({ theme }) => theme.colors.lfRed.hover};
  }
`

export const DeletedText = styled.div`
  font-size: 14px;
  color: #aaa;
  font-style: italic;
`

export const Text = styled.p`
  margin-top: 4px;
  font-size: 14px;
  white-space: pre-line;
  color: #333;
`

export const EditField = styled.textarea`
  margin-top: 6px;
  font-size: 14px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  resize: none;
`

export const ActionRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`

export const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.lfGreenMain.base};
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
`

export const CancelButton = styled.button`
  background: ${({ theme }) => theme.colors.lfWhite.base};
  color: ${({ theme }) => theme.colors.lfBlack.base};
  border-radius: 6px;
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
`
