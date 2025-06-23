'use client'

import { useRef, useState } from 'react'

import styled from '@emotion/styled'
import { ChevronDown, ChevronUp, Send } from 'lucide-react'

import { CommentType } from '@/entities/challenge/api'

import { theme } from '@/shared/config'

import { CommentItem } from '../verification-comment-item'

interface CommentListProps {
  comments: CommentType[]
  onSubmit: (content: string) => void
  onReplySubmit: (id: number, content: string) => void
  onUpdate: (id: number, content: string) => void
  onDelete: (id: number) => void
}

export const CommentList = ({ comments, onSubmit, onReplySubmit, onUpdate, onDelete }: CommentListProps) => {
  // 🔒 IME 조합 추적 (댓글: -1, 답글: id)
  const isComposingMapRef = useRef<Record<number, boolean>>({})

  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({})
  const [replyInputMap, setReplyInputMap] = useState<Record<number, string>>({})
  const [newCommentInput, setNewCommentInput] = useState('')
  //댓글 작성 자동 스크롤 ref
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const handleCompositionStart = (id: number) => {
    isComposingMapRef.current[id] = true
  }

  const handleCompositionEnd = (id: number) => {
    isComposingMapRef.current[id] = false
  }

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleReplies = (id: number) => {
    setExpandedMap(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleNewCommentSubmit = () => {
    const content = newCommentInput.trim()
    if (!content) return

    setNewCommentInput('')
    onSubmit(content)
    // 스크롤 이동
    setTimeout(scrollToBottom, 100)
  }

  const handleReplyChange = (commentId: number, value: string) => {
    setReplyInputMap(prev => ({ ...prev, [commentId]: value }))
  }

  const handleReplySubmit = (parentCommentId: number) => {
    const content = replyInputMap[parentCommentId]?.trim()
    if (!content) return

    setReplyInputMap(prev => ({ ...prev, [parentCommentId]: '' }))
    onReplySubmit(parentCommentId, content)
  }

  const handleUpdate = (id: number, content: string) => {
    onUpdate(id, content)
  }

  const handleDelete = (id: number) => {
    onDelete(id)
  }

  const handleKeyDownNewComment = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 조합중인 경우 무시
    if (isComposingMapRef.current[-1]) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const content = newCommentInput.trim()
      if (content) {
        handleNewCommentSubmit()
      }
    }
  }

  const handleKeyDownReply = (e: React.KeyboardEvent<HTMLTextAreaElement>, parentCommentId: number) => {
    // 한글 조합중인 경우 무시
    if (isComposingMapRef.current[parentCommentId]) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()

      const content = e.currentTarget.value.trim()
      if (!content) return

      handleReplySubmit(parentCommentId)
    }
  }

  return (
    <Container>
      <TextareaWrapper>
        <CommentTextarea
          placeholder='댓글을 작성하세요'
          value={newCommentInput}
          onChange={e => setNewCommentInput(e.target.value)}
          onKeyDown={e => handleKeyDownNewComment(e)}
          onCompositionStart={() => handleCompositionStart(-1)}
          onCompositionEnd={() => handleCompositionEnd(-1)}
        />
        <SubmitButton onClick={handleNewCommentSubmit} size={20} />
      </TextareaWrapper>
      <CommentListWrapper>
        {comments.map(comment => (
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
                    onKeyDown={e => handleKeyDownReply(e, comment.id)}
                    onCompositionStart={() => handleCompositionStart(comment.id)}
                    onCompositionEnd={() => handleCompositionEnd(comment.id)}
                  />
                  <SubmitButton onClick={() => handleReplySubmit(comment.id)} size={20} />
                </ReplyTextAreaWrapper>
              </ReplyBox>
            )}
          </CommentWrapper>
        ))}
        <div ref={bottomRef} />
      </CommentListWrapper>
    </Container>
  )
}

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
  margin: 4px 0 10px 5px;
  font-size: 13px;
  color: ${theme.colors.lfGreenMain.base};
  background: none;
  border: none;
  cursor: pointer;
`

const ReplyBox = styled.div`
  margin: 0 0 10px 10px;
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
