'use client'
import { ReactNode, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import { CommentList } from '@/features/challenge/components'

import {
  CreateVerificationLikeResponse,
  CreateVerificationLikeVariables,
  DeleteCommentVariables,
  DeleteVerificationLikeResponse,
  DeleteVerificationLikeVariables,
  CommentResponse,
  CommentType,
  RepliesType,
  getVerificationCommentList,
  getVerificationDetails,
  PostCommentVariables,
  PostReplyVariables,
  PutCommentVariables,
  VerificationDetailResponse,
} from '@/entities/challenge/api'

import { Loading, LucideIcon } from '@/shared/components'
import { MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { useConfirmModalStore, useUserStore } from '@/shared/context'
import { useToast } from '@/shared/hooks'
import { getTimeDiff } from '@/shared/lib'
import { copyToClipboard } from '@/shared/lib/utils'
import { ISOFormatString } from '@/shared/type'

import LikeIcon from '@public/icon/like.svg'
import UnLikeIcon from '@public/icon/unLike.svg'

import * as S from './styles'

interface VerificationDetailsProps {
  challengeId: number
  verificationId: number
  className?: string
}

export const VerificationDetails = ({
  challengeId,
  verificationId,
  className,
}: VerificationDetailsProps): ReactNode => {
  const { openConfirmModal } = useConfirmModalStore()
  const { isLoggedIn, userInfo } = useUserStore()
  const { toast } = useToast()
  const router = useRouter()

  const { data: verificationData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.DETAILS(challengeId, verificationId),
    queryFn: () => getVerificationDetails({ challengeId, verificationId }),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.DETAILS,
  })

  const { data: commentData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT(challengeId, verificationId),
    queryFn: () => getVerificationCommentList(challengeId, verificationId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.COMMENT,
  })

  // 댓글 작성
  const { mutate: commentMutation } = useMutationStore<CommentType, PostCommentVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.CREATE,
  )

  // 대댓글 작성
  const { mutate: replyMutation } = useMutationStore<RepliesType, PostReplyVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.CREATE,
  )

  // 댓글/대댓글 수정
  const { mutate: updateMutation } = useMutationStore<CommentType, PutCommentVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.MODIFY,
  )

  // 댓글/대댓글 삭제
  const { mutate: deleteMutation } = useMutationStore<null, DeleteCommentVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.DELETE,
  )

  /** 좋아요 추가 API */
  const { mutate: likeMutate } = useMutationStore<CreateVerificationLikeResponse, CreateVerificationLikeVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.LIKES.CREATE,
  )
  /** 좋아요 삭제 API */
  const { mutate: unlikeMutate } = useMutationStore<DeleteVerificationLikeResponse, DeleteVerificationLikeVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.LIKES.DELETE,
  )

  const verifications: VerificationDetailResponse = verificationData?.data ?? ({} as VerificationDetailResponse)

  const comments: CommentResponse = commentData?.data ?? ({} as CommentResponse)

  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [commentCount, setCommentCount] = useState<number>(0)

  useEffect(() => {
    if (verificationData?.data) {
      setIsLiked(verificationData.data.isLiked)
      setLikeCount(verificationData.data.counts.like ?? 0)
      setCommentCount(verificationData.data.counts.comment ?? 0)
    }
  }, [verificationData?.data])

  const [localComments, setLocalComments] = useState<CommentType[]>(comments?.comments ?? [])

  useEffect(() => {
    if (comments?.comments) {
      setLocalComments(comments.comments)
    }
  }, [comments])

  /** 좋아요 핸들러 */
  const handleLikeToggle = () => {
    // #0. 로그인 상태가 아닐 때
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }
    // 롤백용 현재 상태
    const prevLiked = isLiked
    const prevCount = likeCount

    // 낙관적 업데이트
    setIsLiked(!prevLiked)
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1)

    const mutationFn = prevLiked ? unlikeMutate : likeMutate
    const params = { challengeId, verificationId }
    mutationFn(params, {
      onError: () => {
        // 실패하면 rollback
        setIsLiked(prevLiked)
        setLikeCount(prevCount)

        toast('Error', '좋아요 처리 중 오류가 발생했습니다.')
      },
    })
  }

  /** 클립보드 복사 */
  const handleCopyVerificationUrl = () => {
    const url = `${window.location.origin}${URL.CHALLENGE.GROUP.VERIFICATION.LIST.value(challengeId)}`
    copyToClipboard(url)
  }

  //댓글 작성 핸들러
  const handleCommentSubmit = (content: string) => {
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }
    const tempId = Date.now()
    const prev = structuredClone(localComments)

    const optimisticComment: CommentType = {
      id: tempId,
      content,
      createdAt: new Date().toISOString() as ISOFormatString,
      updatedAt: new Date().toISOString() as ISOFormatString,
      nickname: userInfo?.nickname ?? '나',
      profileImageUrl:
        userInfo?.imageUrl ?? 'https://storage.googleapis.com/leafresh-prod-images/init/chatbot/chatbot.png',
      parentCommentId: null,
      isMine: true,
      deleted: false,
      replies: [],
    }
    const prevComment = commentCount

    //낙관적 업데이트
    setLocalComments(prev => [...prev, optimisticComment])
    setCommentCount(prevComment + 1)

    commentMutation(
      {
        challengeId,
        verificationId,
        body: { content: content },
      },
      {
        onSuccess: response => {
          const updatedComment = response.data
          setLocalComments(prev => prev.map(comment => (comment.id === tempId ? updatedComment : comment)))
        },
        onError: () => {
          setLocalComments(prev) // rollback
          setCommentCount(prevComment)
          toast('Error', '댓글 작성에 실패했습니다.')
        },
      },
    )
  }

  //대댓글 작성 핸들러
  const handleReplySubmit = (parentCommentId: number, content: string) => {
    if (!isLoggedIn) {
      openConfirmModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동 하시겠습니까?',
        onConfirm: () => router.push(URL.MEMBER.LOGIN.value),
      })
      return
    }

    const tempId = Date.now()
    const prev = structuredClone(localComments)
    const prevComment = commentCount

    const optimisticReply = {
      id: tempId,
      content,
      createdAt: new Date().toISOString() as ISOFormatString,
      updatedAt: new Date().toISOString() as ISOFormatString,
      nickname: userInfo?.nickname ?? '나',
      profileImageUrl:
        userInfo?.imageUrl ?? 'https://storage.googleapis.com/leafresh-prod-images/init/chatbot/chatbot.png',
      parentCommentId,
      isMine: true,
      deleted: false,
    }

    // 낙관적 업데이트
    setLocalComments(prev =>
      prev.map(comment =>
        comment.id === parentCommentId
          ? {
              ...comment,
              replies: [...(comment.replies ?? []), optimisticReply],
            }
          : comment,
      ),
    )
    setCommentCount(prevComment + 1)

    replyMutation(
      {
        challengeId,
        verificationId,
        commentId: parentCommentId,
        body: { comment: content },
      },
      {
        onSuccess: response => {
          const updatedReply = response.data as RepliesType

          setLocalComments(prev =>
            prev.map(comment => {
              if (comment.id !== parentCommentId) return comment

              const updatedReplies = (comment.replies ?? []).map(reply =>
                reply.id === tempId ? updatedReply : reply,
              ) as RepliesType[] // ✅ 명확히 캐스팅

              return { ...comment, replies: updatedReplies }
            }),
          )
        },

        onError: () => {
          setCommentCount(prevComment)
          setLocalComments(prev) // rollback
          toast('Error', '답글 작성에 실패했습니다.')
        },
      },
    )
  }

  //댓글/대댓글 수정 핸들러
  const handleCommentUpdate = (id: number, content: string) => {
    const prev = structuredClone(localComments)

    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === id) {
          return { ...comment, content, updatedAt: new Date().toISOString() as ISOFormatString }
        }
        return {
          ...comment,
          replies: comment.replies?.map(reply =>
            reply.id === id ? { ...reply, content, updatedAt: new Date().toISOString() as ISOFormatString } : reply,
          ),
        }
      }),
    )

    updateMutation(
      {
        challengeId,
        verificationId,
        commentId: id,
        body: { content: content },
      },
      {
        onError: () => {
          setLocalComments(prev) // rollback
          toast('Error', '수정에 실패했습니다.')
        },
      },
    )
  }

  //댓글/대댓글 삭제 핸들러
  const handleCommentDelete = (id: number) => {
    openConfirmModal({
      title: '댓글 삭제',
      description: '정말 삭제하시겠습니까?',
      onConfirm: () => {
        const prev = structuredClone(localComments)
        const prevComment = commentCount
        const nickname = '(알수없음)'
        const content = '삭제된 댓글입니다.'

        setCommentCount(prevComment - 1)

        setLocalComments(prev =>
          prev.map(comment => {
            if (comment.id === id) {
              return {
                ...comment,
                nickname,
                content,
                deleted: true,
                updatedAt: new Date().toISOString() as ISOFormatString,
              }
            }
            return {
              ...comment,
              replies: comment.replies?.map(reply =>
                reply.id === id
                  ? {
                      ...reply,
                      nickname,
                      content,
                      deleted: true,
                      updatedAt: new Date().toISOString() as ISOFormatString,
                    }
                  : reply,
              ),
            }
          }),
        )

        //mutation 실행
        deleteMutation(
          {
            challengeId,
            verificationId,
            commentId: id,
          },
          {
            onError: () => {
              setCommentCount(prevComment)
              setLocalComments(prev) // rollback
              toast('Error', '삭제에 실패했습니다.')
            },
          },
        )
      },
    })
  }
  if (!verifications) {
    return <Loading /> // 로딩 스피너나 빈 화면 처리
  }
  return (
    <S.Container>
      <S.Header>
        <S.ProfileCircle src={verifications.profileImageUrl} alt='profile' width={36} height={36} />
        <S.Info>
          <S.Nickname>{verifications.nickname}</S.Nickname>
          <S.Time>{getTimeDiff(verifications.createdAt)}</S.Time>
        </S.Info>
      </S.Header>

      <S.ImageWrapper>
        <S.ContentImage src={verifications.imageUrl} alt='Leafresh' fill />
      </S.ImageWrapper>

      <S.Content>{verifications.content}</S.Content>

      <S.Stats>
        <S.LeftStat>
          <S.LikeButton onClick={handleLikeToggle}>
            <S.LikeIconImage src={isLiked ? LikeIcon : UnLikeIcon} alt='좋아요 아이콘' />
            {likeCount}
          </S.LikeButton>
          <S.Stat>
            <LucideIcon name='MessageCircle' size={16} strokeWidth={1.5} />
            {commentCount}
          </S.Stat>
          <S.Stat onClick={handleCopyVerificationUrl}>
            <LucideIcon name='SquareArrowOutUpRight' size={16} strokeWidth={1.5} />
          </S.Stat>
        </S.LeftStat>
        <S.Stat>조회수 {verifications.counts?.view ?? 0}</S.Stat>
        {/* <Stat>조회수 {verifications.counts.view}</Stat> */}
      </S.Stats>
      <CommentList
        comments={localComments ?? []}
        onSubmit={handleCommentSubmit}
        onReplySubmit={handleReplySubmit}
        onUpdate={handleCommentUpdate}
        onDelete={handleCommentDelete}
      />
    </S.Container>
  )
}
