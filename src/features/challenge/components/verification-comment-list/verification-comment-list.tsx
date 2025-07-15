'use client'

import { useRef, useState } from 'react'

import { CommentType } from '@/entities/challenge/api'

import { LucideIcon } from '@/shared/components'

import { CommentItem } from '../verification-comment-item'

import { SubmitButton } from './styles'
import * as S from './styles'

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
    <S.Container>
      <S.TextareaWrapper>
        <S.CommentTextarea
          placeholder='댓글을 작성하세요'
          value={newCommentInput}
          onChange={e => setNewCommentInput(e.target.value)}
          onKeyDown={e => handleKeyDownNewComment(e)}
          onCompositionStart={() => handleCompositionStart(-1)}
          onCompositionEnd={() => handleCompositionEnd(-1)}
        />
        <SubmitButton name='Send' size={20} onClick={handleNewCommentSubmit} />
      </S.TextareaWrapper>
      <S.CommentListWrapper>
        {comments.map(comment => (
          <S.CommentWrapper key={comment.id}>
            <CommentItem comment={comment} onUpdate={handleUpdate} onDelete={handleDelete} />

            {comment.replies && comment.replies.length > 0 ? (
              <S.ToggleReplyButton onClick={() => toggleReplies(comment.id)}>
                {expandedMap[comment.id] ? (
                  <>
                    <LucideIcon name='ChevronUp' size={16} />
                    답글 숨기기
                  </>
                ) : (
                  <>
                    <LucideIcon name='ChevronDown' size={16} />
                    {comment.replies.length}개의 답글 보기
                  </>
                )}
              </S.ToggleReplyButton>
            ) : (
              <S.ToggleReplyButton onClick={() => toggleReplies(comment.id)}>
                {expandedMap[comment.id] ? (
                  <>
                    <LucideIcon name='ChevronUp' size={16} /> 닫기
                  </>
                ) : (
                  <>
                    <LucideIcon name='ChevronDown' size={16} /> 답글 작성
                  </>
                )}
              </S.ToggleReplyButton>
            )}

            {comment.replies && expandedMap[comment.id] && (
              <S.ReplyBox>
                {comment.replies.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={{ ...reply, parentCommentId: null }}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}

                <S.ReplyTextAreaWrapper>
                  <S.ReplyTextarea
                    placeholder='답글을 입력하세요'
                    value={replyInputMap[comment.id] || ''}
                    onChange={e => handleReplyChange(comment.id, e.target.value)}
                    onKeyDown={e => handleKeyDownReply(e, comment.id)}
                    onCompositionStart={() => handleCompositionStart(comment.id)}
                    onCompositionEnd={() => handleCompositionEnd(comment.id)}
                  />
                  <S.SubmitButton name='Send' onClick={() => handleReplySubmit(comment.id)} size={20} />
                </S.ReplyTextAreaWrapper>
              </S.ReplyBox>
            )}
          </S.CommentWrapper>
        ))}
        <div ref={bottomRef} />
      </S.CommentListWrapper>
    </S.Container>
  )
}
