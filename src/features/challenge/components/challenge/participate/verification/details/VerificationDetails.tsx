'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@tanstack/react-query'

import { DeleteCommentVariables } from '@features/challenge/api/participate/verification/delete-verification-comment'
import {
  CommentResponse,
  CommentType,
  getVerificationCommemtList,
} from '@features/challenge/api/participate/verification/get-verification-comment-list'
import {
  getVerificationDetails,
  VerificationDetailResponse,
} from '@features/challenge/api/participate/verification/get-verifycation-details'
import {
  CreateVerificationLikeResponse,
  CreateVerificationLikeVariables,
} from '@features/challenge/api/participate/verification/likes/create-like'
import {
  DeleteVerificationLikeResponse,
  DeleteVerificationLikeVariables,
} from '@features/challenge/api/participate/verification/likes/delete-like'
import { PostCommentVariables } from '@features/challenge/api/participate/verification/post-verification-comment'
import { PostReplyVariables } from '@features/challenge/api/participate/verification/post-verification-reply'
import { PutCommentVariables } from '@features/challenge/api/participate/verification/put-verification-comment'
import CommentList from '@features/challenge/components/challenge/participate/verification/details/comment-list'
import { useMutationStore } from '@shared/config/tanstack-query/mutation-defaults'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import { URL } from '@shared/constants/route/route'
import { useConfirmModalStore } from '@shared/context/modal/ConfirmModalStore'
import { ToastType } from '@shared/context/toast/type'
import { useAuth } from '@shared/hooks/useAuth/useAuth'
import { useToast } from '@shared/hooks/useToast/useToast'
import { getTimeDiff } from '@shared/lib/date/utils'
import { copyToClipboard } from '@shared/lib/ui/copy-clipboard'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { responsiveHorizontalPadding } from '@shared/styles/ResponsiveStyle'
import { theme } from '@shared/styles/theme'
import { ISOFormatString } from '@shared/types/date'
import Like from '@public/icon/like.svg'
import UnLike from '@public/icon/unLike.svg'

interface VerificationDetailsProps {
  challengeId: number
  verificationId: number
  className?: string
}

const VerificationDetails = ({ challengeId, verificationId, className }: VerificationDetailsProps): ReactNode => {
  const { openConfirmModal } = useConfirmModalStore()
  const { isLoggedIn, userInfo } = useAuth()
  const openToast = useToast()
  const router = useRouter()

  const { data: verificationData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.DETAILS(challengeId, verificationId),
    queryFn: () => getVerificationDetails(challengeId, verificationId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.DETAILS,
  })

  const { data: commentData } = useQuery({
    queryKey: QUERY_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT(challengeId, verificationId),
    queryFn: () => getVerificationCommemtList(challengeId, verificationId),
    ...QUERY_OPTIONS.CHALLENGE.GROUP.VERIFICATION.COMMENT,
  })

  // 댓글 작성
  const { mutate: commentMutation } = useMutationStore<CommentResponse, PostCommentVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.CREATE,
    // mutationFn: postVerificationComment,
  )

  // 대댓글 작성
  const { mutate: replyMutation } = useMutationStore<CommentResponse, PostReplyVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.CREATE,
    // mutationFn: postVerificationReply,
  )

  // 댓글/대댓글 수정
  const { mutate: updateMutation } = useMutationStore<CommentResponse, PutCommentVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.MODIFY,
    // mutationFn: putVerificationComment,
  )

  // 댓글/대댓글 삭제
  const { mutate: deleteMutation } = useMutationStore<null, DeleteCommentVariables>(
    MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.DELETE,
    // mutationFn: deleteVerificationComment,
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

  // const verifications: VerificationDetailResponse = verificationData?.data ?? (dummypost as VerificationDetailResponse)
  // const comments: CommentResponse = commentData?.data ?? (dummycomments as CommentResponse)

  const [isLiked, setIsLiked] = useState(verificationData?.data.isLiked)
  const [likeCount, setLikeCount] = useState(verificationData?.data.counts.like ?? 0)
  const [localComments, setLocalComments] = useState<CommentType[]>(comments.comment ?? [])

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

    setLocalComments(prev => [...prev, optimisticComment])

    commentMutation(
      {
        challengeId,
        verificationId,
        body: { comment: content },
      },
      {
        onError: () => {
          // 롤백
          setLocalComments(prev)
          openToast(ToastType.Error, '댓글 작성에 실패했어요😢')
        },
        onSuccess: () => {},
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

    // optimistic update
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

    replyMutation(
      {
        challengeId,
        verificationId,
        commentId: parentCommentId,
        body: { comment: content },
      },
      {
        onError: () => {
          setLocalComments(prev) // rollback
          openToast(ToastType.Error, '답글 작성에 실패했어요😢')
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
        body: { comment: content },
      },
      {
        onError: () => {
          setLocalComments(prev) // rollback
          openToast(ToastType.Error, '수정에 실패했어요😢')
        },
      },
    )
  }

  //댓글/대댓글 삭제 핸들러
  const handleCommentDelete = (id: number) => {
    const prev = structuredClone(localComments)
    const nickname = '(알 수 없음)'
    const content = '(삭제된 댓글입니다.)'
    setLocalComments(prev =>
      prev.map(comment => {
        if (comment.id === id) {
          return { ...comment, nickname, content, updatedAt: new Date().toISOString() as ISOFormatString }
        }
        return {
          ...comment,
          replies: comment.replies?.map(reply =>
            reply.id === id
              ? { ...reply, nickname, content, updatedAt: new Date().toISOString() as ISOFormatString }
              : reply,
          ),
        }
      }),
    )
    deleteMutation(
      {
        challengeId,
        verificationId,
        commentId: id,
      },
      {
        onError: () => {
          setLocalComments(prev) // rollback
          openToast(ToastType.Error, '삭제에 실패했어요😢')
        },
      },
    )
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
        <ContentImage src={verifications.imageUrl} alt='Leafresh' />
      </ImageWrapper>

      <Content>{verifications.content}</Content>

      <Stats>
        <LeftStat>
          <LikeButton onClick={handleLikeToggle}>
            {isLiked ? <LikeIcon src={Like} alt='♥' /> : <LikeIcon src={UnLike} alt='♥' />}
            {likeCount}
          </LikeButton>
          <Stat>
            <LucideIcon name='MessageCircle' size={16} strokeWidth={1.5} />
            {verifications.counts.comment}
          </Stat>
          <Stat onClick={handleCopyVerificationUrl}>
            <LucideIcon name='SquareArrowOutUpRight' size={16} strokeWidth={1.5} />
          </Stat>
        </LeftStat>
        <Stat>조회수 {verifications.counts.view}</Stat>
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

export default VerificationDetails

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
  height: 200px;
  border-radius: ${theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const ContentImage = styled.img`
  position: relative;
  aspect-ratio: 5 / 3;
  overflow: hidden;
`

const Content = styled.p`
  padding: 16px 0;
  font-size: 14px;
  color: #333;
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

const LikeIcon = styled(Image)`
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
