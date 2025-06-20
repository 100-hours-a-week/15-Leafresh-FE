import Image from 'next/image'
import { useState } from 'react'

import { CommentType } from '@/entities/challenge/api'
import { theme } from '@/shared/config'
import { getTimeDiff } from '@/shared/lib'
import styled from '@emotion/styled'

interface CommentItemProps {
  comment: CommentType
  onUpdate: (id: number, content: string) => void
  onDelete: (id: number) => void
}

export const CommentItem = ({ comment, onUpdate, onDelete }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(comment.content)

  const handleUpdate = () => {
    if (!editedText.trim()) return
    onUpdate(comment.id, editedText)
    setIsEditing(false)
  }

  return (
    <CommentItemWrapper>
      <ContentArea>
        <Header>
          <UserWrapper>
            <Avatar src={comment.profileImageUrl} alt='avatar' width={36} height={36}></Avatar>
            <Nickname>{comment.nickname || '(알수 없음)'}</Nickname>
          </UserWrapper>
          <Meta>
            <Time>{getTimeDiff(comment.createdAt)}</Time>
            {comment.isMine && !isEditing && !comment.deleted && (
              <Controls>
                <EditButton onClick={() => setIsEditing(true)}>수정</EditButton>
                <DeleteButton onClick={() => onDelete(comment.id)}>삭제</DeleteButton>
              </Controls>
            )}
          </Meta>
        </Header>
        {comment.deleted ? (
          <DeletedText>삭제된 댓글입니다.</DeletedText>
        ) : isEditing ? (
          <>
            <EditField
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              placeholder='댓글을 작성하세요'
            />
            <ActionRow>
              <CancelButton onClick={() => setIsEditing(false)}>취소</CancelButton>
              <SubmitButton onClick={handleUpdate}>수정하기</SubmitButton>
            </ActionRow>
          </>
        ) : (
          <Text>{comment.content}</Text>
        )}
      </ContentArea>
    </CommentItemWrapper>
  )
}

const CommentItemWrapper = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 0;
`

const Avatar = styled(Image)`
  width: 32px;
  height: 32px;
  background: #ddd;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ContentArea = styled.div`
  flex: 1;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const Meta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #888;
`

const Nickname = styled.span`
  font-weight: 600;
`

const Time = styled.span``

const Controls = styled.div`
  display: flex;
  gap: 6px;
`

const EditButton = styled.button`
  font-size: 12px;
  color: ${theme.colors.lfBlue.base};
  background: none;
  border: none;
  cursor: pointer;
  :hover {
    color: ${theme.colors.lfBlue.hover};
  }
`
const DeleteButton = styled.button`
  font-size: 12px;
  color: ${theme.colors.lfRed.base};
  background: none;
  border: none;
  cursor: pointer;
  :hover {
    color: ${theme.colors.lfRed.hover};
  }
`

const DeletedText = styled.div`
  font-size: 14px;
  color: #aaa;
  font-style: italic;
`

const Text = styled.p`
  margin-top: 4px;
  font-size: 14px;
  color: #333;
`

const EditField = styled.textarea`
  margin-top: 6px;
  font-size: 14px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  resize: none;
`

const ActionRow = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`

const SubmitButton = styled.button`
  background: ${theme.colors.lfGreenMain.base};
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
`

const CancelButton = styled.button`
  background: ${theme.colors.lfWhite.base};
  color: ${theme.colors.lfBlack.base};
  border-radius: 6px;
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
`
