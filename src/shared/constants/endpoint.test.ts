// src/shared/constants/endpoint.test.ts
import { describe, it, expect } from 'vitest'
import { ENDPOINTS } from './endpoint'
import { HttpMethod } from './http'

describe('ENDPOINTS 상수 검증', () => {
  it('이벤트 챌린지 목록 엔트리', () => {
    expect(ENDPOINTS.CHALLENGE.CHALLENGE.EVENT.LIST).toEqual({
      method: HttpMethod.GET,
      path: '/api/challenges/events',
    })
  })

  it('개인 챌린지 상세 엔트리', () => {
    const id = 1
    expect(ENDPOINTS.CHALLENGE.CHALLENGE.PERSONAL.DETAILS(id)).toEqual({
      method: HttpMethod.GET,
      path: `/api/challenges/personal/${id}`,
    })
  })

  it('단체 챌린지 수정 엔트리', () => {
    const id = 1
    expect(ENDPOINTS.CHALLENGE.CHALLENGE.GROUP.UPDATE(id)).toEqual({
      method: HttpMethod.PATCH,
      path: `/api/challenges/group/${id}`,
    })
  })

  it('인증 결과 확인 엔트리', () => {
    const id = 5
    expect(ENDPOINTS.CHALLENGE.CHALLENGE.VERIFICATION_RESULT(id)).toEqual({
      method: HttpMethod.GET,
      path: `/api/verifications/${id}/result`,
    })
  })

  it('OAuth 로그인 및 콜백 엔트리', () => {
    const prov = 'KAKAO'
    expect(ENDPOINTS.MEMBERS.AUTH.INDEX(prov)).toEqual({
      method: HttpMethod.GET,
      path: `/oauth/${prov}`,
    })
    expect(ENDPOINTS.MEMBERS.AUTH.CALLBACK(prov)).toEqual({
      method: HttpMethod.GET,
      path: `/oauth/${prov}/callback`,
    })
  })

  it('Presigned URL 및 이미지 업로드 엔트리', () => {
    expect(ENDPOINTS.S3.PRESIGNED_URL).toEqual({
      method: HttpMethod.POST,
      path: '/s3/images/presigned-url',
    })
    expect(ENDPOINTS.S3.UPLOAD).toEqual({
      method: HttpMethod.PUT,
      path: '/s3/images',
    })
  })

  it('게시글 상세 및 삭제 엔트리', () => {
    const postId = 42
    expect(ENDPOINTS.POSTS.DETAILS(postId)).toEqual({
      method: HttpMethod.GET,
      path: `/api/posts/${postId}`,
    })
    expect(ENDPOINTS.POSTS.DELETE(postId)).toEqual({
      method: HttpMethod.DELETE,
      path: `/api/posts/${postId}`,
    })
  })

  it('챗봇 추천 엔트리', () => {
    expect(ENDPOINTS.CHATBOT.CATEGORY).toEqual({
      method: HttpMethod.POST,
      path: '/api/chatbot/recommendation/base-info',
    })
    expect(ENDPOINTS.CHATBOT.CHATTING).toEqual({
      method: HttpMethod.POST,
      path: '/api/chatbot/recommendation/free-text',
    })
  })
})
