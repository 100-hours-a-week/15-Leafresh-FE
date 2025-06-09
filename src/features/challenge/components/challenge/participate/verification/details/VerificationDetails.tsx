'use client'
import Image from 'next/image'

import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'
import { useMutation, useQuery } from '@tanstack/react-query'

import { deleteVerificationComment } from '@features/challenge/api/participate/verification/delete-verification-comment'
import {
  CommentResponse,
  getVerificationCommemtList,
} from '@features/challenge/api/participate/verification/get-verification-comment-list'
import {
  getVerificationDetails,
  VerificationDetailResponse,
} from '@features/challenge/api/participate/verification/get-verifycation-details'
import { postVerificationComment } from '@features/challenge/api/participate/verification/post-verification-comment'
import { postVerificationReply } from '@features/challenge/api/participate/verification/post-verification-reply'
import { putVerificationComment } from '@features/challenge/api/participate/verification/put-verification-comment'
import { MUTATION_KEYS } from '@shared/config/tanstack-query/mutation-keys'
import { QUERY_OPTIONS } from '@shared/config/tanstack-query/query-defaults'
import { QUERY_KEYS } from '@shared/config/tanstack-query/query-keys'
import LucideIcon from '@shared/lib/ui/LucideIcon'
import { theme } from '@shared/styles/theme'
import Like from '@public/icon/like.svg'
import UnLike from '@public/icon/unLike.svg'

import CommentList from './CommentList'

interface VerificationDetailsProps {
  challengeId: number
  verificationId: number
  className?: string
}

export const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 30) return `${days}일 전`
  if (months < 12) return `${months}달 전`
  return `${years}년 전`
}

const VerificationDetails = ({ challengeId, verificationId, className }: VerificationDetailsProps): ReactNode => {
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
  const commentMutation = useMutation({
    mutationKey: MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.CREATE,
    mutationFn: postVerificationComment,
  })

  // 대댓글 작성
  const replyMutation = useMutation({
    mutationKey: MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.CREATE,
    mutationFn: postVerificationReply,
  })

  // 댓글/대댓글 수정
  const updateMutation = useMutation({
    mutationKey: MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.MODIFY,
    mutationFn: putVerificationComment,
  })

  // 댓글/대댓글 삭제
  const deleteMutation = useMutation({
    mutationKey: MUTATION_KEYS.CHALLENGE.GROUP.VERIFICATION.COMMENT.REPLY.DELETE,
    mutationFn: deleteVerificationComment,
  })

  //   const verifications: VerificationDetailResponse = verificationData?.data ?? ({} as VerificationDetailResponse)
  //   const comments: CommentResponse = commentData?.data ?? ({} as CommentResponse)

  const [isLiked, setIsLiked] = useState(verificationData?.data.isLiked)
  const [likeCount, setLikeCount] = useState(verificationData?.data.counts.like ?? 0)

  const verifications: VerificationDetailResponse = verificationData?.data ?? (dummypost as VerificationDetailResponse)
  const comments: CommentResponse = commentData?.data ?? (dummycomments as CommentResponse)

  const handleLikeToggle = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1))
  }

  const handleCommentSubmit = (content: string) => {
    commentMutation.mutate({
      challengeId,
      verificationId,
      body: { comment: content },
    })
  }

  const handleReplySubmit = (parentCommentId: number, content: string) => {
    replyMutation.mutate({
      challengeId,
      verificationId,
      commentId: parentCommentId,
      body: { comment: content },
    })
  }

  const handleCommentUpdate = (id: number, content: string) => {
    updateMutation.mutate({
      challengeId,
      verificationId,
      commentId: id,
      body: { comment: content },
    })
  }

  const handleCommentDelete = (id: number) => {
    deleteMutation.mutate({
      challengeId,
      verificationId,
      commentId: id,
    })
  }

  return (
    <Container>
      <Header>
        <ProfileCircle src={verifications.profileImageUrl} alt='profile' width={36} height={36} />
        <Info>
          <Nickname>{verifications.nickname}</Nickname>
          <Time>{formatTimeAgo(verifications.createdAt)}</Time>
        </Info>
      </Header>

      <ImageBox>
        <ContentImage src={verifications.imageUrl} alt='Leafresh' />
      </ImageBox>

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
          <Stat>
            <LucideIcon name='SquareArrowOutUpRight' size={16} strokeWidth={1.5} />
          </Stat>
        </LeftStat>
        <Stat>조회수 {verifications.counts.view}</Stat>
      </Stats>
      <CommentList
        comments={comments.comment}
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
  max-width: 480px;
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

const ImageBox = styled.div`
  width: 100%;
  height: 200px;
  border-radius: ${theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const ContentImage = styled.img`
  object-fit: cover;
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

const dummypost = {
  id: 1,
  nickname: '닉네임',
  profileImageUrl: '/image/chatbot/chatbot.png',
  isLiked: false,
  imageUrl: '/image/chatbot/beach.jpg',
  content: '친환경 세제를 사용해 설거지를 했어요! 앞으로도 지구를 위해 친환경 제품을 사용하려고 합니다.',
  category: 'ZERO_WASTE',
  status: 'SUCCESS',
  verifiedAt: '2025-04-20T14:00:00Z',
  counts: {
    view: 100,
    like: 4,
    comment: 3,
  },
  createdAt: '2025-04-20T14:00:00Z',
  updatedAt: '2025-04-20T15:00:00Z',
}

const dummycomments: CommentResponse = {
  comment: [
    {
      id: 1,
      content: '친환경 세제 정보 궁금해요! 어떤 제품 사용하셨나요? 저도 바꿔보고 싶어요.',
      createdAt: '2025-04-20T14:10:00Z',
      updatedAt: '2025-04-20T14:10:00Z',
      nickname: '닉네임',
      profileImageUrl: '/image/chatbot/chatbot.png',
      parentCommentId: null,
      isMine: false,
      deleted: false,
      replies: [
        {
          id: 2,
          content: '저는 ○○ 브랜드 사용하고 있어요! 거품도 잘 나고 설거지도 잘 돼요',
          createdAt: '2025-04-20T14:12:00Z',
          updatedAt: '2025-04-20T14:12:00Z',
          nickname: '닉네임',
          profileImageUrl: '/image/chatbot/chatbot.png',
          parentCommentId: 1,
          isMine: true,
          deleted: false,
        },
      ],
    },
    {
      id: 3,
      content: '친환경 세제 정보 궁금해요! 어떤 제품 사용하셨나요? 저도 바꿔보고 싶어요.',
      createdAt: '2025-04-20T14:10:00Z',
      updatedAt: '2025-04-20T14:10:00Z',
      nickname: '닉네임',
      profileImageUrl: '/image/chatbot/chatbot.png',
      parentCommentId: null,
      isMine: true,
      deleted: false,
      replies: [
        {
          id: 4,
          content: '저는 ○○ 브랜드 사용하고 있어요! 거품도 잘 나고 설거지도 잘 돼요',
          createdAt: '2025-06-08T14:12:00Z',
          updatedAt: '2025-04-20T14:12:00Z',
          nickname: '닉네임',
          profileImageUrl: '/image/chatbot/chatbot.png',
          parentCommentId: 3,
          isMine: true,
          deleted: false,
        },
      ],
    },
    {
      id: 5,
      content: '친환경 세제 정보 궁금해요! 어떤 제품 사용하셨나요? 저도 바꿔보고 싶어요.',
      createdAt: '2025-04-20T14:10:00Z',
      updatedAt: '2025-04-20T14:10:00Z',
      nickname: '닉네임',
      profileImageUrl: '/image/chatbot/chatbot.png',
      parentCommentId: null,
      isMine: true,
      deleted: false,
      replies: [],
    },
  ],
}
