'use client'

import { useState } from 'react'

import { CommentType } from '@/entities/challenge/api'

import { getTimeDiff } from '@/shared/lib'

import * as S from './styles'
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

  const handleKeyDownUpdateComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const content = editedText.trim()
      if (content) {
        handleUpdate()
      }
    }
  }

  return (
    <S.CommentItemWrapper>
      <S.ContentArea>
        <S.Header>
          <S.UserWrapper>
            <S.Avatar src={comment.profileImageUrl} alt='avatar' width={36} height={36}></S.Avatar>
            <S.Nickname>{comment.nickname || '(알수 없음)'}</S.Nickname>
          </S.UserWrapper>
          <S.Meta>
            <S.Time>{getTimeDiff(comment.createdAt)}</S.Time>
            {comment.isMine && !isEditing && !comment.deleted && (
              <S.Controls>
                <S.EditButton onClick={() => setIsEditing(true)}>수정</S.EditButton>
                <S.DeleteButton onClick={() => onDelete(comment.id)}>삭제</S.DeleteButton>
              </S.Controls>
            )}
          </S.Meta>
        </S.Header>
        {comment.deleted ? (
          <S.DeletedText>삭제된 댓글입니다.</S.DeletedText>
        ) : isEditing ? (
          <>
            <S.EditField
              value={editedText}
              onChange={e => setEditedText(e.target.value)}
              onKeyDown={handleKeyDownUpdateComment}
              placeholder='댓글을 작성하세요'
            />
            <S.ActionRow>
              <S.CancelButton onClick={() => setIsEditing(false)}>취소</S.CancelButton>
              <S.SubmitButton onClick={handleUpdate}>수정하기</S.SubmitButton>
            </S.ActionRow>
          </>
        ) : (
          <S.Text>{comment.content}</S.Text>
        )}
      </S.ContentArea>
    </S.CommentItemWrapper>
  )
}
