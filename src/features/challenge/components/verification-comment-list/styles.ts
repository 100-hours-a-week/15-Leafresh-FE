import styled from '@emotion/styled'

import { LucideIcon } from '@/shared/components'
export const Container = styled.div`
  width: 100%;
`

export const CommentWrapper = styled.div`
  border-bottom: solid 1px ${({ theme }) => theme.colors.lfGray.base};
`

export const TextareaWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const CommentTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  min-height: 100px;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 10px 40px 10px 12px;
  font-size: 14px;
  resize: none;
`

export const SubmitButton = styled(LucideIcon)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
`

export const CommentListWrapper = styled.div`
  border-top: 1px solid #eee;
`

export const ToggleReplyButton = styled.button`
  display: flex;
  flex-direction: row;
  margin: 4px 0 10px 5px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.lfGreenMain.base};
  background: none;
  border: none;
  cursor: pointer;
`

export const ReplyBox = styled.div`
  margin: 0 0 10px 10px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.lfInputBackground.base};
  border-radius: 8px;
`

export const ReplyTextAreaWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;

  position: relative;
  align-items: center;
`

export const ReplyTextarea = styled.textarea`
  width: 100%;
  padding: 10px 40px 10px 12px;
  height: 70px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
  resize: none;
`
