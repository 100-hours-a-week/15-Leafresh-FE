// src/app/shared/constants/api.test.ts
import { describe, expect, it } from 'vitest'

import { API } from './endpoint'

describe('API 상수 검증', () => {
  it('이벤트 챌린지 목록 엔트리', () => {
    expect(API.challenges.events).toEqual({
      method: 'GET',
      path: '/api/challenges/events',
    })
  })

  it('개인 챌린지 상세 엔트리', () => {
    const id = 1
    expect(API.challenges.personalDetail(id)).toEqual({
      method: 'GET',
      path: `/api/challenges/personal/${id}+`,
    })
  })

  it('단체 챌린지 수정 엔트리', () => {
    const id = 1
    expect(API.challenges.updateGroup(id)).toEqual({
      method: 'PATCH',
      path: `/api/challenges/group/${id}`,
    })
  })

  it('OAuth 로그인 및 콜백 엔트리', () => {
    const prov = 'KAKAO'
    expect(API.members.oauth(prov)).toEqual({
      method: 'GET',
      path: `/oauth/${prov}`,
    })
    expect(API.members.callback(prov)).toEqual({
      method: 'GET',
      path: `/oauth/${prov}/callback`,
    })
  })

  it('s3 Presigned URL 및 이미지 PUT 엔트리', () => {
    expect(API.s3.presignedUrl).toEqual({
      method: 'POST',
      path: '/s3/images/presigned-url',
    })
    expect(API.s3.images).toEqual({
      method: 'PUT',
      path: '/s3/images',
    })
  })

  it('게시글 상세 및 삭제 엔트리', () => {
    const postId = 42
    expect(API.posts.detail(postId)).toEqual({
      method: 'GET',
      path: `/api/posts/${postId}`,
    })
    expect(API.posts.delete(postId)).toEqual({
      method: 'DELETE',
      path: `/api/posts/${postId}`,
    })
  })

  it('챗봇 추천 엔트리', () => {
    expect(API.chatbot.recommendByBaseInfo).toEqual({
      method: 'POST',
      path: '/api/chatbot/recommendation/base-info',
    })
    expect(API.chatbot.recommendByFreeText).toEqual({
      method: 'POST',
      path: '/api/chatbot/recommendation/free-text',
    })
  })
})
