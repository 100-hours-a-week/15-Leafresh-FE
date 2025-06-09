'use client'

import { ChevronDown, ChevronUp, Send } from 'lucide-react'

import { useState } from 'react'
import styled from '@emotion/styled'

import { useUserStore } from '@entities/member/context/UserStore'
import { CommentResponse } from '@features/challenge/api/participate/verification/get-verification-comment-list'
import { theme } from '@shared/styles/theme'

import CommentItem from './CommentItem'

interface CommentListProps {
  comments: CommentResponse['comment']
  onSubmit: (content: string) => void
  onReplySubmit: (id: number, content: string) => void
  onUpdate: (id: number, content: string) => void
  onDelete: (id: number) => void
}

const CommentList = ({ comments, onSubmit, onReplySubmit, onUpdate, onDelete }: CommentListProps) => {
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({})
  const [replyInputMap, setReplyInputMap] = useState<Record<number, string>>({})
  const [newCommentInput, setNewCommentInput] = useState('')
  const [localComments, setLocalComments] = useState(comments)
  const { userInfo } = useUserStore()

  const toggleReplies = (id: number) => {
    setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleNewCommentSubmit = () => {
    const content = newCommentInput.trim()
    if (!content) return

    const newComment = {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nickname: userInfo?.nickname ?? '나',
      profileImageUrl: userInfo?.imageUrl ?? '/image/chatbot/chatbot.png',
      parentCommentId: null,
      isMine: true,
      deleted: false,
      replies: [],
    }

    setLocalComments(prev => [newComment, ...prev])
    setNewCommentInput('')
    onSubmit(content)
  }

  const handleReplyChange = (commentId: number, value: string) => {
    setReplyInputMap(prev => ({ ...prev, [commentId]: value }))
  }

  const handleReplySubmit = (parentCommentId: number) => {
    const content = replyInputMap[parentCommentId]?.trim()
    if (!content) return

    const newReply = {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nickname: userInfo?.nickname ?? '나',
      profileImageUrl: userInfo?.imageUrl ?? '/image/chatbot/chatbot.png',
      parentCommentId,
      isMine: true,
      deleted: false,
    }

    setLocalComments(prev =>
      prev.map(comment =>
        comment.id === parentCommentId
          ? {
              ...comment,
              replies: [...(comment.replies ?? []), newReply],
            }
          : comment,
      ),
    )

    setReplyInputMap(prev => ({ ...prev, [parentCommentId]: '' }))
    onReplySubmit(parentCommentId, content)
  }

  const handleUpdate = (id: number, content: string) => {
    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === id) return { ...comment, content, updatedAt: new Date().toISOString() }
        return {
          ...comment,
          replies: comment.replies?.map(reply =>
            reply.id === id ? { ...reply, content, updatedAt: new Date().toISOString() } : reply,
          ),
        }
      }),
    )
    onUpdate(id, content)
  }

  const handleDelete = (id: number) => {
    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === id) return { ...comment, deleted: true, content: '삭제된 댓글입니다.' }
        return {
          ...comment,
          replies: comment.replies?.map(reply =>
            reply.id === id ? { ...reply, deleted: true, content: '삭제된 댓글입니다.' } : reply,
          ),
        }
      }),
    )
    onDelete(id)
  }

  return (
    <Container>
      <TextareaWrapper>
        <CommentTextarea
          placeholder='댓글을 작성하세요'
          value={newCommentInput}
          onChange={e => setNewCommentInput(e.target.value)}
        />
        <SubmitButton onClick={handleNewCommentSubmit} size={20} />
      </TextareaWrapper>
      <CommentListWrapper>
        {localComments.map(comment => (
          <CommentWrapper key={comment.id}>
            <CommentItem comment={comment} onUpdate={handleUpdate} onDelete={handleDelete} />

            {comment.replies && comment.replies.length > 0 ? (
              <ToggleReplyButton onClick={() => toggleReplies(comment.id)}>
                {expandedMap[comment.id] ? (
                  <>
                    <ArrowUp />
                    답글 숨기기
                  </>
                ) : (
                  <>
                    <ArrowDown />
                    {comment.replies.length}개의 답글 보기
                  </>
                )}
              </ToggleReplyButton>
            ) : (
              <ToggleReplyButton onClick={() => toggleReplies(comment.id)}>
                {expandedMap[comment.id] ? (
                  <>
                    {' '}
                    <ArrowUp /> 닫기
                  </>
                ) : (
                  <>
                    {' '}
                    <ArrowDown /> 답글 작성
                  </>
                )}
              </ToggleReplyButton>
            )}

            {comment.replies && expandedMap[comment.id] && (
              <ReplyBox>
                {comment.replies.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={{ ...reply, parentCommentId: null }}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}

                <ReplyTextAreaWrapper>
                  <ReplyTextarea
                    placeholder='답글을 입력하세요'
                    value={replyInputMap[comment.id] || ''}
                    onChange={e => handleReplyChange(comment.id, e.target.value)}
                  />
                  <SubmitButton onClick={() => handleReplySubmit(comment.id)} size={20} />
                </ReplyTextAreaWrapper>
              </ReplyBox>
            )}
          </CommentWrapper>
        ))}
      </CommentListWrapper>
    </Container>
  )
}

export default CommentList

const Container = styled.div`
  width: 100%;
`

const CommentWrapper = styled.div`
  border-bottom: solid 1px ${theme.colors.lfGray.base};
`

const TextareaWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const CommentTextarea = styled.textarea`
  flex: 1;
  width: 100%;
  min-height: 100px;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 10px 40px 10px 12px;
  font-size: 14px;
  resize: none;
`

const SubmitButton = styled(Send)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
`

const CommentListWrapper = styled.div`
  border-top: 1px solid #eee;
`

const ToggleReplyButton = styled.button`
  display: flex;
  flex-direction: row;
  margin: 4px 0 10px 20px;
  font-size: 13px;
  color: ${theme.colors.lfGreenMain.base};
  background: none;
  border: none;
  cursor: pointer;
`

const ReplyBox = styled.div`
  margin: 0 0 10px 40px;
  padding: 10px;
  background: ${theme.colors.lfInputBackground.base};
  border-radius: 8px;
`

const ReplyTextAreaWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;

  position: relative;
  align-items: center;
`

const ReplyTextarea = styled.textarea`
  width: 100%;
  padding: 10px 40px 10px 12px;
  height: 70px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
  resize: none;
`

const ArrowDown = styled(ChevronDown)`
  width: 16px;
  height: 16px;
`

const ArrowUp = styled(ChevronUp)`
  width: 16px;
  height: 16px;
`
