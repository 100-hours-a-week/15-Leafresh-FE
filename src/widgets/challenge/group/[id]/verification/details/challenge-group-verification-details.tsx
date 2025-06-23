'use client'
import { ReactNode, useEffect, useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import styled from '@emotion/styled'
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
import { theme, MUTATION_KEYS, QUERY_KEYS, QUERY_OPTIONS, useMutationStore } from '@/shared/config'
import { URL } from '@/shared/constants'
import { ToastType, useConfirmModalStore } from '@/shared/context'
import { useAuth, useToast } from '@/shared/hooks'
import { getTimeDiff } from '@/shared/lib'
import { copyToClipboard } from '@/shared/lib/utils'
import { responsiveHorizontalPadding } from '@/shared/styles'
import { ISOFormatString } from '@/shared/type'

import LikeIcon from '@public/icon/like.svg'
import UnLikeIcon from '@public/icon/unLike.svg'

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
  const { isLoggedIn, userInfo } = useAuth()
  const openToast = useToast()
  const router = useRouter()
  const isClient = typeof window !== 'undefined'

  const { data: verificationData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.DETAILS(challengeId, verificationId),
    queryFn: () => getVerificationDetails({ challengeId, verificationId }),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.DETAILS,
    // enabled: isClient,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  const [isLiked, setIsLiked] = useState(verificationData?.data.isLiked)
  const [commentCount, setCommentCount] = useState(verificationData?.data.counts.comment ?? 0)
  const [likeCount, setLikeCount] = useState(verificationData?.data.counts.like ?? 0)

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

        openToast(ToastType.Error, '좋아요 처리 중 오류가 발생했습니다.')
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
      profileImageUrl: userInfo?.imageUrl ?? '/image/chatbot/chatbot.png',
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
          openToast(ToastType.Error, '댓글 작성에 실패했습니다.')
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
      profileImageUrl: userInfo?.imageUrl ?? '/image/chatbot/chatbot.png',
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
        body: { content: content },
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
          openToast(ToastType.Error, '답글 작성에 실패했습니다.')
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
          openToast(ToastType.Error, '수정에 실패했습니다.')
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
              openToast(ToastType.Error, '삭제에 실패했습니다.')
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
    <Container>
      <Header>
        <ProfileCircle src={verifications.profileImageUrl} alt='profile' width={36} height={36} />
        <Info>
          <Nickname>{verifications.nickname}</Nickname>
          <Time>{getTimeDiff(verifications.createdAt)}</Time>
        </Info>
      </Header>

      <ImageWrapper>
        <ContentImage src={verifications.imageUrl} alt='Leafresh' fill />
      </ImageWrapper>

      <Content>{verifications.content}</Content>

      <Stats>
        <LeftStat>
          <LikeButton onClick={handleLikeToggle}>
            <LikeIconImage src={isLiked ? LikeIcon : UnLikeIcon} alt='좋아요 아이콘' />
            {likeCount}
          </LikeButton>
          <Stat>
            <LucideIcon name='MessageCircle' size={16} strokeWidth={1.5} />
            {commentCount}
          </Stat>
          <Stat onClick={handleCopyVerificationUrl}>
            <LucideIcon name='SquareArrowOutUpRight' size={16} strokeWidth={1.5} />
          </Stat>
        </LeftStat>
        <Stat>조회수 {verifications.counts?.view ?? 0}</Stat>
        {/* <Stat>조회수 {verifications.counts.view}</Stat> */}
      </Stats>
      <CommentList
        comments={localComments ?? []}
        onSubmit={handleCommentSubmit}
        onReplySubmit={handleReplySubmit}
        onUpdate={handleCommentUpdate}
        onDelete={handleCommentDelete}
      />
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  ${responsiveHorizontalPadding}
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
`

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`

const ProfileCircle = styled(Image)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Nickname = styled.div`
  font-size: 14px;
  font-weight: bold;
`

const Time = styled.div`
  font-size: 12px;
  color: #888;
`

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 5 / 3;
  border-radius: ${theme.radius.md};

  position: relative;
  overflow: hidden;
`

const ContentImage = styled(Image)`
  position: relative;
  object-fit: cover;
  object-position: center;
`

const Content = styled.p`
  padding: 16px 0;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
`

const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 10px 0;
`

const LeftStat = styled.div`
  display: flex;
  gap: 16px;
`

const Stat = styled.div`
  display: flex;
  align-items: center;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
  gap: 4px;
`

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.lfBlack.base};
  cursor: pointer;
`

const LikeIconImage = styled(Image)`
  height: 16px;
  width: auto;
`

// const dummypost = {
//   id: 1,
//   nickname: '닉네임',
//   profileImageUrl: '/image/chatbot/chatbot.png',
//   isLiked: false,
//   imageUrl: '/image/chatbot/beach.jpg',
//   content: '친환경 세제를 사용해 설거지를 했어요! 앞으로도 지구를 위해 친환경 제품을 사용하려고 합니다.',
//   category: 'ZERO_WASTE',
//   status: 'SUCCESS',
//   verifiedAt: '2025-04-20T14:00:00Z',
//   counts: {
//     view: 100,
//     like: 4,
//     comment: 3,
//   },
//   createdAt: '2025-04-20T14:00:00Z',
//   updatedAt: '2025-04-20T15:00:00Z',
// }

// const dummycomments: CommentResponse = {
//   comment: [
//     {
//       id: 1,
//       content: '친환경 세제 정보 궁금해요! 어떤 제품 사용하셨나요? 저도 바꿔보고 싶어요.',
//       createdAt: '2025-04-20T14:10:00Z' as ISOFormatString,
//       updatedAt: '2025-04-20T14:10:00Z' as ISOFormatString,
//       nickname: '닉네임',
//       profileImageUrl: '/image/chatbot/chatbot.png',
//       parentCommentId: null,
//       isMine: false,
//       deleted: false,
//       replies: [
//         {
//           id: 2,
//           content: '저는 ○○ 브랜드 사용하고 있어요! 거품도 잘 나고 설거지도 잘 돼요',
//           createdAt: '2025-04-20T14:12:00Z' as ISOFormatString,
//           updatedAt: '2025-04-20T14:12:00Z' as ISOFormatString,
//           nickname: '닉네임',
//           profileImageUrl: '/image/chatbot/chatbot.png',
//           parentCommentId: 1,
//           isMine: true,
//           deleted: false,
//         },
//       ],
//     },
//     {
//       id: 3,
//       content: '친환경 세제 정보 궁금해요! 어떤 제품 사용하셨나요? 저도 바꿔보고 싶어요.',
//       createdAt: '2025-04-20T14:10:00Z' as ISOFormatString,
//       updatedAt: '2025-04-20T14:10:00Z' as ISOFormatString,
//       nickname: '닉네임',
//       profileImageUrl: '/image/chatbot/chatbot.png',
//       parentCommentId: null,
//       isMine: true,
//       deleted: false,
//       replies: [
//         {
//           id: 4,
//           content: '저는 ○○ 브랜드 사용하고 있어요! 거품도 잘 나고 설거지도 잘 돼요',
//           createdAt: '2025-06-08T14:12:00Z' as ISOFormatString,
//           updatedAt: '2025-04-20T14:12:00Z' as ISOFormatString,
//           nickname: '닉네임',
//           profileImageUrl: '/image/chatbot/chatbot.png',
//           parentCommentId: 3,
//           isMine: true,
//           deleted: false,
//         },
//       ],
//     },
//     {
//       id: 5,
//       content: '친환경 세제 정보 궁금해요! 어떤 제품 사용하셨나요? 저도 바꿔보고 싶어요.',
//       createdAt: '2025-04-20T14:10:00Z' as ISOFormatString,
//       updatedAt: '2025-04-20T14:10:00Z' as ISOFormatString,
//       nickname: '닉네임',
//       profileImageUrl: '/image/chatbot/chatbot.png',
//       parentCommentId: null,
//       isMine: true,
//       deleted: false,
//       replies: [],
//     },
//   ],
// }
